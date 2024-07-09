import { Upload, Modal } from 'antd';
import React from 'react';

class ImageUpload extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  render() {
    const { previewVisible, previewImage} = this.state;
    const { fileList = [], onChange } = this.props;
    const uploadButton = (
      <div>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={onChange}
          beforeUpload={() => false}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal open={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default ImageUpload;