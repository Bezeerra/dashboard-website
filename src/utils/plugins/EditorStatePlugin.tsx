import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export default function EditorStatePlugin({content}: any): any {
    const [editor] = useLexicalComposerContext();
    editor.update(() => {
        if (content){
            editor.setEditorState(editor.parseEditorState(content))
        }
    })

}