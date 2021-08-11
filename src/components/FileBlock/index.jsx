import React from 'react';
import { FcFile } from "react-icons/fc"

import style from './style.scss'

const FileBlock = ({ fileName, onClick, path }) => (
	<li onClick={(e) => onClick(e,path)} className={style.File}><FcFile/>{fileName}</li>
);

export default FileBlock