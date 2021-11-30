import React from 'react';
import {useDropzone} from "react-dropzone";
import styled from 'styled-components'

const getColor = (props) => {
    if (props.isDragAccept) {
        return '#00e676';
    }
    if (props.isDragReject) {
        return '#ff1744';
    }
    if (props.isDragActive) {
        return '#2196f3';
    }
    return '#eeeeee';
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${props => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border .24s ease-in-out;
`;

export const UploadComponent = props => {
    const { setFieldValue } = props;
    const {
        acceptedFiles,
        fileRejections,
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        multiple: false,
        accept: 'image/*',
        onDrop:acceptedFiles => {
            console.log(acceptedFiles);
            console.log(Array.isArray(acceptedFiles));
            console.log(acceptedFiles.length);
            if (Array.isArray(acceptedFiles) && acceptedFiles.length > 0) {
                setFieldValue('files', acceptedFiles)
                setFieldValue('file', acceptedFiles[0])
            }
        }
    });

    const files = acceptedFiles.map(file => (<p  key={file.path}>{file.path} - {(file.size/1024).toFixed(2)} kb</p>));

    return (
        <div>
            <div>
                <Container {...getRootProps({isDragActive, isDragAccept, isDragReject})}>
                    <input {...getInputProps()} />
                    <p>Drop the image here, or click to select.</p>
                </Container>
            </div>
            <div>
               {files} &nbsp;
            </div>
        </div>
    );
};