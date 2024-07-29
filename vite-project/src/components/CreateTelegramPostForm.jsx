import {
    Form, Radio,
    Button, Input, Flex, DatePicker, message, Switch, Spin, Checkbox, ConfigProvider
} from 'antd';
import 'react-quill/dist/quill.snow.css';
import React from 'react';
import ImageUpload from "./ImageUpload.jsx";
import CreateButtons from "./CreateButtons.jsx";


const { Item: FormItem } = Form;
const { TextArea } = Input;



const CreateTelegramPostForm = ({ fetchWithAuth }) => {
    const [fileList, setFileList] = React.useState([]);
    const [publishNow, setPublishNow] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [channels, setChannels] = React.useState([]);
    const [selectedChannels, setSelectedChannels] = React.useState([]);


    React.useEffect(() => {
      const fetchChannels = async () => {
          try {
              const response = await fetchWithAuth('http://127.0.0.1:8000/channels', {method: 'GET'});
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
            formData.append('photos', file.originFileObj);
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
          const response = await fetchWithAuth('/api/create_post/', {
              method: 'POST',
              body: formData,
          });
          const result = await response.json();

          if (response.ok) {
              message.success('Пост создан успешно');
              console.log('Success:', result);
          } else {
              message.error(result.detail || 'Ошибка при создании поста');
              console.error('Error:', response.statusText);
          }
      } catch (error) {
          console.error('Error:', error);
      } finally {
          setLoading(false);
      }
    }

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handlePublishNowChange = (checked) => {
    setPublishNow(checked);
  };

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 }
  };

    return (
        <Spin spinning={loading}>
            <Form onFinish={handleSubmit}>
              
                <FormItem label="Фотографии" {...formItemLayout} name="photos" valuePropName="fileList" getValueFromEvent={normFile}>
                  <ImageUpload fileList={fileList} onChange={handleFileChange}/>
                </FormItem>

                <FormItem label="Текст" {...formItemLayout} name="text">
                  <TextArea showCount maxLength={10000} placeholder="Текст поста" />
                </FormItem>

                {fileList.length <= 1 && (
                  <FormItem label="Кнопки" {...formItemLayout} name="buttons">
                    <CreateButtons />
                  </FormItem>
                )}
                

                <FormItem label="Дата удаления" {...formItemLayout} name="delete_time">
                  <DatePicker showTime format="YYYY-MM-DD HH:mm"/>
                </FormItem>

                <FormItem label="Опубликовать сразу" {...formItemLayout}>
                  <Switch defaultChecked={publishNow} onChange={handlePublishNowChange} />
                </FormItem>

                <Form.Item label="Каналы для публикации" {...formItemLayout}>
                    <Checkbox.Group options={channels.map(channel => ({ label: channel.title, value: channel.username }))} onChange={handleChannelChange} />
                </Form.Item>

                {!publishNow && (
                  <FormItem label="Дата публикации" {...formItemLayout} name="publish_time">
                    <DatePicker showTime format="YYYY-MM-DD HH:mm"/>
                  </FormItem>
                )}

                <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                    <Button type="primary" htmlType="submit">{publishNow ? 'Опубликовать' : 'Запланировать'}</Button>
                </FormItem>
            </Form>
        </Spin>

    );

}

export default CreateTelegramPostForm;
