import ExampleTheme from "./themes/ExampleTheme.tsx";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin.tsx";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";

import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin.tsx";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin.tsx";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin.tsx";
import {OnChangePlugin} from "@lexical/react/LexicalOnChangePlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import {EditorState} from "lexical";
import EditorStatePlugin from "./plugins/EditorStatePlugin.tsx";

function Placeholder() {
  return (<div className="editor-placeholder">Enter some rich text...</div>)
}

const editorConfig = {
  theme: ExampleTheme,
  editorState: null,
  editable: true,
  onError(error: any) {
    throw error;
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode
  ]
}

interface PropsEditor {
  setContent: (value: any) => void;
  content?: any;
  isEditable?: boolean
}


export default function Editor({setContent, content, isEditable = true}: PropsEditor) {

    return ( <div className="lexical">
    {/* @ts-ignore */}
    <LexicalComposer initialConfig={{
      ...editorConfig,
      editable: isEditable,
    }}>
      <div className="editor-container container border-2">
        {isEditable && <ToolbarPlugin />}
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <EditorStatePlugin content={content} isEditable={isEditable}/>
          <OnChangePlugin  onChange={(editor: EditorState) => setContent(editor.toJSON())} />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </div>
    </LexicalComposer>
  </div>);
}
