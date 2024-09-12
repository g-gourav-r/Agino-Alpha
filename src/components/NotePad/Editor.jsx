import React, { Component } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';

Quill.register('modules/imageResize', ImageResize);

class Editor extends Component {
  constructor(props) {
    super(props);
    // Initialize state with the editor content passed via props
    this.state = { editorHtml: props.value || '' };
    this.handleChange = this.handleChange.bind(this);
  }

  // Update state and notify parent component about changes
  handleChange(html) {
    this.setState({ editorHtml: html });
    if (this.props.onChange) {
      this.props.onChange(html); // Notify parent component
    }
  }

  // Update local state when props change
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value !== prevState.editorHtml) {
      return { editorHtml: nextProps.value };
    }
    return null;
  }

  render() {
    return (
      <ReactQuill
        theme="snow" // Set theme directly
        onChange={this.handleChange}
        value={this.state.editorHtml}
        modules={Editor.modules}
        formats={Editor.formats}
        bounds={'#root'}
        placeholder={this.props.placeholder}
      />
    );
  }
}

// Quill modules to attach to editor
Editor.modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' }
    ],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false
  },
  imageResize: {
    parchment: Quill.import('parchment'),
    modules: ['Resize', 'DisplaySize']
  }
};

// Quill editor formats
Editor.formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video'
];

export default Editor;
