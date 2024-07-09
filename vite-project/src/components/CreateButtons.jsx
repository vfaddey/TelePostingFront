import React, {useState} from 'react';
import { Form, Input, Button, Space, Card, Select, Row, Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Item: FormItem, List: FormList } = Form;
const { Option } = Select;

const CreateButtons = () => {
  const handleSubmit = (values) => {
    console.log('Received values of form: ', values);
  };

  const [rows, setRows] = useState([[]]);

  const handleAdd = (add) => {
    setRows((prevRows) => {
      const lastRow = prevRows[prevRows.length - 1];
      if (lastRow.length < 3) {
        lastRow.push({});
      } else {
        prevRows.push([{}]);
      }
      return [...prevRows];
    });
    add();
  };

  const handleRemove = (name, remove) => {
    setRows((prevRows) => {
      let updatedRows = [...prevRows];
      let found = false;
      for (let i = 0; i < updatedRows.length; i++) {
        for (let j = 0; j < updatedRows[i].length; j++) {
          if (updatedRows[i][j] === name) {
            updatedRows[i].splice(j, 1);
            found = true;
            break;
          }
        }
        if (found) break;
        if (updatedRows[i].length === 0) {
          updatedRows.splice(i, 1);
          break;
        }
      }
      return updatedRows;
    });
    remove(name);
  };

  return (
          <FormList name="buttons">
          {(fields, { add, remove }) => (
            <>
              {rows.map((row, rowIndex) => (
                <Row gutter={[16, 16]} key={rowIndex}>
                  {fields.slice(rowIndex * 3, rowIndex * 3 + 3).map(({ key, name, ...restField }) => (
                    <Col span={8} key={key}>
                      <Card title={`Кнопка ${name + 1}`} style={{ marginBottom: 16 }}>
                        <Space
                          direction="vertical"
                          style={{ display: 'flex' }}
                        >
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
                  ))}
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
