import React from "react";
import {Button, Form, message, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";


const { Item: FormItem } = Form;

const UploadXLSXForm = ({fetchWithAuth}) =>  {

    const handleSubmit = async (values) => {
      const hasContent = values.file;

      if (!hasContent) {
          message.error('Форма не может быть полностью пустой. Пожалуйста, заполните хотя бы одно поле.');
          return;
      }

      const formData = new FormData();

      if (values.file) {
        formData.append('file', values.file.file);
      }

      try {
          for (const pair of formData.entries()) {
              console.log(pair[0] + ': ' + pair[1]);
          }
          const response = await fetchWithAuth('/api/create_post/uploadfile', {
              method: 'POST',
              body: formData,
          });

          if (response.ok) {
              const result = await response.json();
              console.log('Success:', result);
          } else {
              console.error('Error:', response.statusText);
          }
      } catch (error) {
          console.error('Error:', error);
      }
  }

    return(
            <Form onFinish={handleSubmit}>
                <FormItem name={"file"}>
                    <Upload
                      listType="picture"
                      maxCount={1}
                      beforeUpload={() => false}
                    >
                      <Button icon={<UploadOutlined />}>Загрузить .xlsx файл</Button>
                    </Upload>
                </FormItem>

                <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                  <Button type="primary" htmlType="submit">Загрузить</Button>
                </FormItem>
            </Form>

    )
}


export default UploadXLSXForm;