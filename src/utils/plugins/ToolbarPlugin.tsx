import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $getNodeByKey, LexicalEditor
} from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $isParentElementRTL,
  $isAtNodeEnd,
  $wrapNodes
} from "@lexical/selection";

import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode
} from "@lexical/list";
import { createPortal } from "react-dom";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode
} from "@lexical/rich-text";
import {
  $createCodeNode,
  $isCodeNode,
  getDefaultCodeLanguage,
  getCodeLanguages
} from "@lexical/code";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faUndo,
  faRedo,
  faChevronDown,
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
  faCode,
  faLink,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faAlignJustify,
  faCheck
} from '@fortawesome/free-solid-svg-icons';

const LowPriority = 1;

const supportedBlockTypes = new Set([
  "paragraph",
  "quote",
  "code",
  "h1",
  "h2",
  "ul",
  "ol"
]);

const blockTypeToBlockName = {
  code: "Code Block",
  h1: "Large Heading",
  h2: "Small Heading",
  h3: "Heading",
  h4: "Heading",
  h5: "Heading",
  ol: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
  ul: "Bulleted List"
};

function Divider() {
  return <div className="divider" />;
}

function positionEditorElement(editor: LexicalEditor | any, rect: any) {
  if (rect === null) {
    editor.style.opacity = "0";
    editor.style.top = "-1000px";
    editor.style.left = "-1000px";
  } else {
    editor.style.opacity = "1";
    editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
    editor.style.left = `${
      rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
    }px`;
  }
}

function FloatingLinkEditor({ editor }: {editor: LexicalEditor}) {
  const editorRef = useRef(null);
  const inputRef = useRef(null);
  const mouseDownRef = useRef(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isEditMode, setEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState(null);

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl("");
      }
    }
    const editorElem = editorRef.current;
    const nativeSelection: Selection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      let rect;
      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      if (!mouseDownRef.current) {
        positionEditorElement(editorElem, rect);
      }
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== "link-input") {
      positionEditorElement(editorElem, null);
      setLastSelection(null);
      setEditMode(false);
      setLinkUrl("");
    }

    return true;
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }: any ) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        LowPriority
      )
    );
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  return (
    <div ref={editorRef} className="link-editor">
      {isEditMode ? (
        <input
          ref={inputRef}
          className="link-input"
          value={linkUrl}
          onChange={(event) => {
            setLinkUrl(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (lastSelection !== null) {
                if (linkUrl !== "") {
                  editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                }
                setEditMode(false);
              }
            } else if (event.key === "Escape") {
              event.preventDefault();
              setEditMode(false);
            }
          }}
        />
      ) : (
        <>
          <div className="link-input">
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
              {linkUrl}
            </a>
            <div
              className="link-edit"
              role="button"
              tabIndex={0}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setEditMode(true);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

function Select({ onChange, className, options, value }: any) {
  return (
    <select className={className} onChange={onChange} value={value}>
      <option hidden={true} value="" />
      {options.map((option: string) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function getSelectedNode(selection: any) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

function BlockOptionsDropdownList({
  editor,
  blockType,
  toolbarRef,
  setShowBlockOptionsDropDown
}: any) {
  const dropDownRef = useRef(null);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    const dropDown = dropDownRef.current;

    if (toolbar !== null && dropDown !== null) {
      const { top, left } = toolbar.getBoundingClientRect();
      dropDown.style.top = `${top + 40}px`;
      dropDown.style.left = `${left}px`;
    }
  }, [dropDownRef, toolbarRef]);

  useEffect(() => {
    const dropDown = dropDownRef.current;
    const toolbar = toolbarRef.current;

    if (dropDown !== null && toolbar !== null) {
      const handle = (event) => {
        const target = event.target;

        if (!dropDown.contains(target) && !toolbar.contains(target)) {
          setShowBlockOptionsDropDown(false);
        }
      };
      document.addEventListener("click", handle);

      return () => {
        document.removeEventListener("click", handle);
      };
    }
  }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);

  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatLargeHeading = () => {
    if (blockType !== "h1") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h1"));
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatSmallHeading = () => {
    if (blockType !== "h2") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h2"));
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatBulletList = () => {
    if (blockType !== "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatNumberedList = () => {
    if (blockType !== "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createQuoteNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createCodeNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  useEffect(() => {
    const toolbar = toolbarRef.current;
    const dropDown = dropDownRef.current;

    if (toolbar !== null && dropDown !== null) {
      const { bottom, left } = toolbar.getBoundingClientRect();
      dropDown.style.top = `${bottom + window.scrollY}px`;
      dropDown.style.left = `${left + window.scrollX}px`;
    }
  }, [dropDownRef, toolbarRef]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target) &&
        !toolbarRef.current.contains(event.target)
      ) {
        setShowBlockOptionsDropDown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);

  const options = [
    { label: "Normal", action: formatParagraph, type: "paragraph" },
    { label: "Large Heading", action: formatLargeHeading, type: "h1" },
    { label: "Small Heading", action: formatSmallHeading, type: "h2" },
    { label: "Bullet List", action: formatBulletList, type: "ul" },
    { label: "Numbered List", action: formatNumberedList, type: "ol" },
    { label: "Quote", action: formatQuote, type: "quote" },
    { label: "Code Block", action: formatCode, type: "code" },
  ];

  return (
    <div
      ref={dropDownRef}
      className="absolute bg-white border border-gray-300 rounded shadow-md mt-2 w-48 z-10"
    >
      {options.map((option) => (
        <button
          key={option.type}
          className="flex items-center w-full px-2 py-1 hover:bg-gray-100 focus:outline-none"
          onClick={() => {
            option.action();
            setShowBlockOptionsDropDown(false);
          }}
        >
          <span className="mr-2">{option.label}</span>
          {blockType === option.type && (
            <FontAwesomeIcon
              icon={faCheck}
              className="ml-auto text-blue-500"
            />
          )}
        </button>
      ))}
    </div>
  );
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");
  const [selectedElementKey, setSelectedElementKey] = useState(null);
  const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] = useState(
    false
  );
  const [codeLanguage, setCodeLanguage] = useState("");
  const [isRTL, setIsRTL] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
          if ($isCodeNode(element)) {
            setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
          }
        }
      }
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  const codeLanguges = useMemo(() => getCodeLanguages(), []);
  const onCodeLanguageSelect = useCallback(
    (e) => {
      editor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(e.target.value);
          }
        }
      });
    },
    [editor, selectedElementKey]
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

 return (
  <div className="toolbar flex flex-wrap items-center space-x-1 sm:space-x-1 p-2 border-b overflow-x-auto" ref={toolbarRef}>
    <button
      disabled={!canUndo}
      onClick={(event) => {
        event.preventDefault();
        editor.dispatchCommand(UNDO_COMMAND);
      }}
      className={`px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded focus:outline-none ${
        !canUndo ? "opacity-50 cursor-not-allowed" : ""
      }`}
      aria-label="Undo"
    >
      <FontAwesomeIcon icon={faUndo} />
    </button>
    <button
      disabled={!canRedo}
      onClick={(event) => {
        event.preventDefault();
        editor.dispatchCommand(REDO_COMMAND);
      }}
      className={`px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded focus:outline-none ${
        !canRedo ? "opacity-50 cursor-not-allowed" : ""
      }`}
      aria-label="Redo"
    >
      <FontAwesomeIcon icon={faRedo} />
    </button>
    <Divider />
    {supportedBlockTypes.has(blockType) && (
      <>
        <button
          className="flex items-center px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded focus:outline-none"
          onClick={(event) => {
            event.preventDefault();
            setShowBlockOptionsDropDown(!showBlockOptionsDropDown);
          }}
          aria-label="Formatting Options"
        >
          <span className="mr-1">{blockTypeToBlockName[blockType]}</span>
          <FontAwesomeIcon icon={faChevronDown} />
        </button>
        {showBlockOptionsDropDown &&
          createPortal(
            <BlockOptionsDropdownList
              editor={editor}
              blockType={blockType}
              toolbarRef={toolbarRef}
              setShowBlockOptionsDropDown={setShowBlockOptionsDropDown}
            />,
            document.body
          )}
        <Divider />
      </>
    )}
    {blockType === "code" ? (
      <Select
        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded focus:outline-none"
        onChange={onCodeLanguageSelect}
        options={codeLanguges}
        value={codeLanguage}
      />
    ) : (
      <>
        <button
          onClick={(event) => {
            event.preventDefault();
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
          }}
          className={`px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded focus:outline-none ${
            isBold ? "text-blue-500" : "text-gray-700"
          }`}
          aria-label="Format Bold"
        >
          <FontAwesomeIcon icon={faBold} />
        </button>
        <button
          onClick={(event) => {
            event.preventDefault();
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
          }}
          className={`px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded focus:outline-none ${
            isItalic ? "text-blue-500" : "text-gray-700"
          }`}
          aria-label="Format Italics"
        >
          <FontAwesomeIcon icon={faItalic} />
        </button>
        <button
          onClick={(event) => {
            event.preventDefault();
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
          }}
          className={`px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded focus:outline-none ${
            isUnderline ? "text-blue-500" : "text-gray-700"
          }`}
          aria-label="Format Underline"
        >
          <FontAwesomeIcon icon={faUnderline} />
        </button>
        <button
          onClick={(event) => {
            event.preventDefault();
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
          }}
          className={`px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded focus:outline-none ${
            isStrikethrough ? "text-blue-500" : "text-gray-700"
          }`}
          aria-label="Format Strikethrough"
        >
          <FontAwesomeIcon icon={faStrikethrough} />
        </button>
        <button
          onClick={(event) => {
            event.preventDefault();
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
          }}
          className={`px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded focus:outline-none ${
            isCode ? "text-blue-500" : "text-gray-700"
          }`}
          aria-label="Insert Code"
        >
          <FontAwesomeIcon icon={faCode} />
        </button>
        <button
          onClick={(event) => {
            event.preventDefault();
            insertLink();
          }}
          className={`px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded focus:outline-none ${
            isLink ? "text-blue-500" : "text-gray-700"
          }`}
          aria-label="Insert Link"
        >
          <FontAwesomeIcon icon={faLink} />
        </button>
        {isLink &&
          createPortal(
            <FloatingLinkEditor editor={editor} />,
            document.body
          )}
        <Divider />
        <button
          onClick={(event) => {
            event.preventDefault();
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
          }}
          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded focus:outline-none"
          aria-label="Left Align"
        >
          <FontAwesomeIcon icon={faAlignLeft} />
        </button>
        <button
          onClick={(event) => {
            event.preventDefault();
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
          }}
          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded focus:outline-none"
          aria-label="Center Align"
        >
          <FontAwesomeIcon icon={faAlignCenter} />
        </button>
        <button
          onClick={(event) => {
            event.preventDefault();
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
          }}
          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded focus:outline-none"
          aria-label="Right Align"
        >
          <FontAwesomeIcon icon={faAlignRight} />
        </button>
        <button
          onClick={(event) => {
            event.preventDefault();
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
          }}
          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded focus:outline-none"
          aria-label="Justify Align"
        >
          <FontAwesomeIcon icon={faAlignJustify} />
        </button>
      </>
    )}
  </div>
);
}
