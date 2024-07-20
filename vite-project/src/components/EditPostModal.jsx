import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Checkbox, Button, message, Spin, Switch } from 'antd';
import ImageUpload from "./ImageUpload.jsx";
import CreateButtons from "./CreateButtons.jsx";
import moment from 'moment';

const { Item: FormItem } = Form;
const { TextArea } = Input;

const EditPostModal = ({ visible, onClose, post, onSave, fetchWithAuth }) => {
  const [fileList, setFileList] = useState([]);
  const [publishNow, setPublishNow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetchWithAuth('http://127.0.0.1:8000/channels', { method: 'GET' });
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
    const loadImages = async () => {
      if (post.photo_ids && post.photo_ids.length > 0) {
        const loadedImages = await Promise.all(post.photo_ids.map(async (id, index) => {
          const response = await fetchWithAuth(`http://127.0.0.1:8000/create_post/photo/${id}`, { method: 'GET' });
          if (response.ok) {
            const blob = await response.blob();
            return {
              uid: id,
              name: `photo_${index}`,
              status: 'done',
              url: URL.createObjectURL(blob),
            };
          }
          return null;
        }));
        setFileList(loadedImages.filter(Boolean));
      } else if (post.photo_urls && post.photo_urls.length > 0) {
        setFileList(post.photo_urls.map((url, index) => ({
          uid: index,
          name: `photo_${index}`,
          status: 'done',
          url,
        })));
      }
    };

    if (post) {
      loadImages();
      setPublishNow(post.publish_now);
      setSelectedChannels(post.channels);
    }
  }, [post, fetchWithAuth]);

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handlePublishNowChange = (checked) => {
    setPublishNow(checked);
  };

  const handleChannelChange = (checkedValues) => {
    setSelectedChannels(checkedValues);
  };

  const handleSubmit = async (values) => {
    const hasContent = values.text || values.publish_time || fileList.length > 0 || (values.buttons && values.buttons.length > 0);

    if (!hasContent) {
      message.error('Форма не может быть полностью пустой. Пожалуйста, заполните хотя бы одно поле.');
      return;
    }

    const formData = new FormData();

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

    if (fileList) {
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('photos', file.originFileObj);
        }
      });
    }

    if (selectedChannels.length > 0) {
      formData.append('channels', JSON.stringify(selectedChannels));
    } else {
      message.error('Нужно выбрать хотя бы один канал для публикации');
      return;
    }

    setLoading(true);
    try {
      const response = await fetchWithAuth(`http://127.0.0.1:8000/update_post/${post.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        message.success('Пост обновлен успешно');
        onSave(result);
        onClose();
      } else {
        message.error('Ошибка при обновлении поста');
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <Modal
      visible={visible}
      title="Редактировать пост"
      onCancel={onClose}
      footer={null}
    >
      <Spin spinning={loading}>
        <Form onFinish={handleSubmit} initialValues={{
          text: post?.text,
          delete_time: post?.delete_time ? moment(post.delete_time) : null,
          publish_time: post?.publish_time ? moment(post.publish_time) : null,
          buttons: post?.buttons,
        }}>
          <FormItem label="Фотографии" name="photos" valuePropName="fileList" getValueFromEvent={normFile}>
            <ImageUpload fileList={fileList} onChange={handleFileChange} />
          </FormItem>

          <FormItem label="Текст" name="text">
            <TextArea showCount maxLength={10000} placeholder="Текст поста" />
          </FormItem>

          <FormItem label="Кнопки" name="buttons">
            <CreateButtons />
          </FormItem>

          <FormItem label="Дата удаления" name="delete_time">
            <DatePicker showTime />
          </FormItem>

          <FormItem label="Опубликовать сразу">
            <Switch checked={publishNow} onChange={handlePublishNowChange} />
          </FormItem>

          <Form.Item label="Каналы для публикации">
            <Checkbox.Group options={channels.map(channel => ({ label: channel.title, value: channel.username }))} value={selectedChannels} onChange={handleChannelChange} />
          </Form.Item>

          {!publishNow && (
            <FormItem label="Дата публикации" name="publish_time">
              <DatePicker showTime />
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
