import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Checkbox, Button, message, Spin, Switch } from 'antd';
import CreateButtons from "./CreateButtons.jsx";
import dayjs from 'dayjs';

const { Item: FormItem } = Form;
const { TextArea } = Input;

const EditPostModal = ({ visible, onClose, post, onSave, fetchWithAuth }) => {
  const [publishNow, setPublishNow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetchWithAuth('/api/channels/', { method: 'GET' });
        if (response.ok) {
          const data = await response.json();
          setChannels(data);
        } else {
          message.error('Ошибка при получении списка каналов');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchChannels();
  }, [fetchWithAuth]);

  useEffect(() => {
    if (post) {
      setPublishNow(post.publish_now);
      setSelectedChannels(post.channels);
    }
  }, [post]);

  const handlePublishNowChange = (checked) => {
    setPublishNow(checked);
  };

  const handleChannelChange = (checkedValues) => {
    setSelectedChannels(checkedValues);
  };

  const handleSubmit = async (values) => {
    const hasContent = values.text || values.publish_time || (values.buttons && values.buttons.length > 0);

    if (!hasContent) {
      message.error('Форма не может быть полностью пустой. Пожалуйста, заполните хотя бы одно поле.');
      return;
    }

    const formData = new FormData();

    formData.append('id', post.id)

    if (values.text) {
      formData.append('text', values.text);
    }

    if (values.buttons) {
      formData.append('buttons', JSON.stringify(values.buttons));
    }

    formData.append('publish_now', publishNow);

    if (!publishNow && values.publish_time) {
      formData.append('publish_time', values.publish_time.toISOString());
    }

    if (values.delete_time) {
      formData.append('delete_time', values.delete_time.toISOString());
    }

    formData.append('photos', JSON.stringify([]));

    if (selectedChannels.length > 0) {
      formData.append('channels', JSON.stringify(selectedChannels));
    } else {
      message.error('Нужно выбрать хотя бы один канал для публикации');
      return;
    }

    setLoading(true);
    try {
      const response = await fetchWithAuth(`/api/create_post/`, {
        method: 'PUT',
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        message.success('Пост обновлен успешно');
        onSave(result);
        onClose();
      } else {
        message.error(result.detail);
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      title="Редактировать пост"
      onCancel={onClose}
      footer={null}
    >
      <Spin spinning={loading}>
        <Form
          onFinish={handleSubmit}
          initialValues={{
            text: post?.text,
            delete_time: post?.delete_time ? dayjs(post.delete_time).add(3, 'hour') : null,
            publish_time: post?.publish_time ? dayjs(post.publish_time).add(3, 'hour') : null,
            buttons: post?.buttons,
          }}
        >
          <FormItem label="Текст" name="text">
            <TextArea showCount maxLength={10000} placeholder="Текст поста" />
          </FormItem>

          <FormItem label="Кнопки" name="buttons">
            <CreateButtons />
          </FormItem>

          <FormItem label="Дата удаления" name="delete_time">
            <DatePicker showTime format="YYYY-MM-DD HH:mm" />
          </FormItem>

          <FormItem label="Опубликовать сразу">
            <Switch checked={publishNow} onChange={handlePublishNowChange} />
          </FormItem>

          <Form.Item label="Каналы для публикации">
            <Checkbox.Group options={channels.map(channel => ({ label: channel.title, value: channel.username }))} value={selectedChannels} onChange={handleChannelChange} />
          </Form.Item>

          {!publishNow && (
            <FormItem label="Дата публикации" name="publish_time">
              <DatePicker showTime format="YYYY-MM-DD HH:mm" />
            </FormItem>
          )}

          <FormItem>
            <Button type="primary" htmlType="submit">Сохранить</Button>
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditPostModal;
