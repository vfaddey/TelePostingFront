import {Button, Checkbox, Form, Input, message, Spin} from "antd";
import {useState} from "react";


const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};


const AddBotForm = ({ fetchWithAuth }) => {
    const [loading, setLoading] = useState(false);
    const onFinish = async (values) => {
        setLoading(true);
        const bot = {
            api_token: values.api_token,
            chosen: values.chosen || false
        };
        try {
            const response = await fetchWithAuth('/api/bots/add', {
                method: 'POST',
                headers: {
                      'Content-Type': 'application/json'
                    },
                body: JSON.stringify(bot)
          });
            if (response.ok) {
                message.success('Бот добавлен!');
            } else {
                const errorData = await response.json();
                message.error(errorData.detail || 'Ошибка добавления бота');
                console.log(errorData)
            }
        } catch (error) {
            message.error( error || 'Ошибка добавления бота');
        } finally {
            setLoading(false)
        }
    }

    return (
        <Spin spinning={loading}>
            <Form
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="API ключ"
              name="api_token"
              rules={[
                {
                  required: true,
                  message: 'Это поле обязательное"',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="chosen"
              valuePropName="checked"
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Checkbox>Сделать ботом по умолчанию</Checkbox>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                  Добавить бота
              </Button>
            </Form.Item>
          </Form>
        </Spin>



    );
}



export default AddBotForm;