import React, { useState } from 'react';
import { Form, Input, Button, Space, Card, Select, Row, Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Item: FormItem, List: FormList } = Form;
const { Option } = Select;

const CreateButtons = () => {
  const handleSubmit = (values) => {
    console.log('Received values of form: ', values);
  };

  const [buttons, setButtons] = useState([]);

  const handleAdd = (add) => {
    setButtons((prevButtons) => [...prevButtons, {}]);
    add();
  };

  const handleRemove = (name, remove) => {
    setButtons((prevButtons) => prevButtons.filter((_, index) => index !== name));
    remove(name);
  };

  return (
      <FormList name="buttons">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Row key={key} gutter={[16, 16]}>
                <Col span={24}>
                  <Card title={`Кнопка ${name + 1}`} style={{ marginBottom: 16 }}>
                    <Space direction="vertical" style={{ display: 'flex' }}>
                      <FormItem
                        {...restField}
                        name={[name, 'type']}
                        rules={[{ required: true, message: 'Выберите тип кнопки' }]}
                      >
                        <Select placeholder="Выберите тип кнопки">
                          <Option value="url">URL</Option>
                          <Option value="text">Обычная кнопка</Option>
                        </Select>
                      </FormItem>
                      <FormItem
                        {...restField}
                        name={[name, 'text']}
                        rules={[{ required: true, message: 'Введите текст кнопки' }]}
                      >
                        <Input placeholder="Текст кнопки" />
                      </FormItem>

                      <FormItem
                        noStyle
                        shouldUpdate={(prevValues, curValues) => prevValues.buttons !== curValues.buttons}
                      >
                        {({ getFieldValue }) => {
                          const type = getFieldValue(['buttons', name, 'type']);
                          if (type === 'url') {
                            return (
                              <FormItem
                                {...restField}
                                name={[name, 'url']}
                                rules={[{ required: true, message: 'Введите URL' }]}
                              >
                                <Input placeholder="URL" />
                              </FormItem>
                            );
                          } else if (type === 'text') {
                            return (
                              <>
                                <FormItem
                                  {...restField}
                                  name={[name, 'subscriberText']}
                                  rules={[{ required: true, message: 'Введите текст для подписчиков' }]}
                                >
                                  <Input placeholder="Текст для подписчиков" />
                                </FormItem>
                                <FormItem
                                  {...restField}
                                  name={[name, 'guestText']}
                                  rules={[{ required: true, message: 'Введите текст для гостей' }]}
                                >
                                  <Input placeholder="Текст для гостей" />
                                </FormItem>
                              </>
                            );
                          }
                          return null;
                        }}
                      </FormItem>
                      <MinusCircleOutlined onClick={() => handleRemove(name, remove)} />
                    </Space>
                  </Card>
                </Col>
              </Row>
            ))}
            <FormItem>
              <Button type="dashed" onClick={() => handleAdd(add)} block icon={<PlusOutlined />}>
                Добавить кнопку
              </Button>
            </FormItem>
          </>
        )}
      </FormList>

  );
};

export default CreateButtons;
