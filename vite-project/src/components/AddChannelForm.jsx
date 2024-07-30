import {Button, Checkbox, Form, Input, message, Spin} from "antd";
import {useState} from "react";


const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};


const AddChannelForm = ({ fetchWithAuth }) => {
    const [loading, setLoading] = useState(false);
    const onFinish = async (values) => {
        setLoading(true);
        const channel = {
            username: '@' + values.username
        };
        try {
            const response = await fetchWithAuth('/api/channels/', {
                method: 'POST',
                headers: {
                      'Content-Type': 'application/json'
                    },
                body: JSON.stringify(channel)
          });
            if (response.ok) {
                message.success('Канал добавлен!');
            } else {
                const errorData = await response.json();
                message.error(errorData.detail || 'Ошибка добавления канала');
                console.log(errorData)
            }
        } catch (error) {
            message.error( error || 'Ошибка добавления канала');
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
              label="Юзернейм канала"
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Это поле обязательное"',
                },
              ]}
            >
              <Input addonBefore="@"/>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                  Добавить канал
              </Button>
            </Form.Item>
          </Form>
        </Spin>



    );
}



export default AddChannelForm;