import React, { useEffect, useRef } from 'react';
import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder'  
import Image from '@tiptap/extension-image'; 
import IconButton from '@mui/material/IconButton';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import CodeIcon from '@mui/icons-material/Code';
import ImageIcon from '@mui/icons-material/Image'; // Import Image icon
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import FormatHeadingIcon from '@mui/icons-material/FormatSize';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import CustomImage from './CustomImage';
import Compressor from 'compressorjs'

import ImageResize from 'tiptap-extension-resize-image'; // Import the ResizeImage extension
const MenuBar = ({ setEditorRef, isChat }) => {
  const { editor } = useCurrentEditor();
  const fileInputRef = useRef(null); 
  if (!editor) {
    return null;
  }

  useEffect(() => {
    if (editor && setEditorRef) {
      setEditorRef(editor);
    }
  }, [editor, setEditorRef]);

  const handleImageUpload = async (event) => {
   
    const file = event.target.files[0];
   
    let compressedFile
    await new Promise<void>((resolve) => {
      new Compressor(file, {
        quality: 0.6,
        maxWidth: 1200,
        mimeType: 'image/webp',
        success(result) {
          const file = new File([result], 'name', {
            type: 'image/webp'
          })
          compressedFile = file
          resolve()
        },
        error(err) {}
      })
    })
   
    if (compressedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result;
        editor.chain().focus().setImage({ src: url , style: "width: auto"}).run();
        fileInputRef.current.value = '';
      };
      reader.readAsDataURL(compressedFile);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current.click(); // Trigger the file input click
  };

  return (
    <div className="control-group">
      <div className="button-group">
        <IconButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
          // color={editor.isActive('bold') ? 'white' : 'gray'}
          sx={{
            color: editor.isActive('bold') ? 'white' : 'gray'
          }}
        >
          <FormatBoldIcon />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
          // color={editor.isActive('italic') ? 'white' : 'gray'}
          sx={{
            color: editor.isActive('italic') ? 'white' : 'gray'
          }}
        >
          <FormatItalicIcon />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleStrike()
              .run()
          }
          // color={editor.isActive('strike') ? 'white' : 'gray'}
          sx={{
            color: editor.isActive('strike') ? 'white' : 'gray'
          }}
        >
          <StrikethroughSIcon />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleCode()
              .run()
          }
          // color={editor.isActive('code') ? 'white' : 'gray'}
          sx={{
            color: editor.isActive('code') ? 'white' : 'gray'
          }}
        >
          <CodeIcon />
        </IconButton>
        <IconButton onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          <FormatClearIcon />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          // color={editor.isActive('bulletList') ? 'white' : 'gray'}
          sx={{
            color: editor.isActive('bulletList') ? 'white' : 'gray'
          }}
        >
          <FormatListBulletedIcon />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          // color={editor.isActive('orderedList') ? 'white' : 'gray'}
          sx={{
            color: editor.isActive('orderedList') ? 'white' : 'gray'
          }}
        >
          <FormatListNumberedIcon />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          // color={editor.isActive('codeBlock') ? 'white' : 'gray'}
          sx={{
            color: editor.isActive('codeBlock') ? 'white' : 'gray'
          }}
        >
          <DeveloperModeIcon />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          // color={editor.isActive('blockquote') ? 'white' : 'gray'}
          sx={{
            color: editor.isActive('blockquote') ? 'white' : 'gray'
          }}
        >
          <FormatQuoteIcon />
        </IconButton>
        <IconButton onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <HorizontalRuleIcon />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          // color={editor.isActive('heading', { level: 1 }) ? 'white' : 'gray'}
          sx={{
            color: editor.isActive('heading', { level: 1 }) ? 'white' : 'gray'
          }}
        >
          <FormatHeadingIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .undo()
              .run()
          }
          sx={{
            color: 'gray'
          }}
        >
          <UndoIcon />
        </IconButton>
        <IconButton
          sx={{
            color: 'gray'
          }}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .redo()
              .run()
          }
        >
          <RedoIcon />
        </IconButton>
        {!isChat && (
          <>
           <IconButton
          onClick={triggerImageUpload}
          sx={{
            color: 'gray'
          }}
        >
          <ImageIcon />
        </IconButton>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageUpload}
          accept="image/*" // Limit file types to images only
        />
          </>
        )}
       
      </div>
    </div>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  Placeholder.configure({
    placeholder: 'Start typing here...',  // Add your placeholder text here
  }),
  ImageResize,
];

const content = ``;

export default ({ setEditorRef, onEnter, disableEnter, isChat }) => {
  console.log('exte', extensions)
  const extensionsFiltered = isChat ? extensions.filter((item)=> item?.name !== 'image') :  extensions
  return (
    <EditorProvider
      slotBefore={<MenuBar setEditorRef={setEditorRef} isChat={isChat} />}
      extensions={extensionsFiltered}
      content={content}
      editorProps={{
        handleKeyDown(view, event) {
          if (!disableEnter && event.key === 'Enter') {
            if (event.shiftKey) {
              // Shift+Enter: Insert a hard break
              view.dispatch(view.state.tr.replaceSelectionWith(view.state.schema.nodes.hardBreak.create()));
              return true;
            } else {
              // Enter: Call the callback function
              if (typeof onEnter === 'function') {
                onEnter();
              }
              return true; // Prevent the default action of adding a new line
            }
          }
          return false; // Allow default handling for other keys
        },
      }}
    />
  );
};
