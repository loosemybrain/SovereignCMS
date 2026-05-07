"use client"

import { useEffect, useReducer } from "react"
import type { CmsBlock } from "@sovereign-cms/core"

type EditorState = {
  selectedBlockId: string | null
  draftBlocks: CmsBlock[]
  isDirty: boolean
  isSaving: boolean
  lastSavedAt: string | null
  saveError: string | null
}

type EditorAction =
  | { type: "setSelectedBlockId"; blockId: string | null }
  | { type: "setDraftBlocks"; blocks: CmsBlock[] }
  | { type: "setIsDirty"; isDirty: boolean }
  | { type: "setIsSaving"; isSaving: boolean }
  | { type: "setLastSavedAt"; savedAt: string | null }
  | { type: "setSaveError"; error: string | null }
  | { type: "resetFromServer"; blocks: CmsBlock[] }

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "setSelectedBlockId":
      return { ...state, selectedBlockId: action.blockId }
    case "setDraftBlocks":
      return { ...state, draftBlocks: action.blocks }
    case "setIsDirty":
      return { ...state, isDirty: action.isDirty }
    case "setIsSaving":
      return { ...state, isSaving: action.isSaving }
    case "setLastSavedAt":
      return { ...state, lastSavedAt: action.savedAt }
    case "setSaveError":
      return { ...state, saveError: action.error }
    case "resetFromServer":
      return {
        selectedBlockId: null,
        draftBlocks: action.blocks,
        isDirty: false,
        isSaving: false,
        lastSavedAt: null,
        saveError: null,
      }
    default:
      return state
  }
}

export function useEditorState(initialBlocks: CmsBlock[]) {
  const [state, dispatch] = useReducer(editorReducer, {
    selectedBlockId: null,
    draftBlocks: initialBlocks,
    isDirty: false,
    isSaving: false,
    lastSavedAt: null,
    saveError: null,
  })

  useEffect(() => {
    dispatch({ type: "resetFromServer", blocks: initialBlocks })
  }, [initialBlocks])

  return {
    selectedBlockId: state.selectedBlockId,
    setSelectedBlockId: (blockId: string | null) =>
      dispatch({ type: "setSelectedBlockId", blockId }),
    draftBlocks: state.draftBlocks,
    setDraftBlocks: (blocks: CmsBlock[]) =>
      dispatch({ type: "setDraftBlocks", blocks }),
    isDirty: state.isDirty,
    setIsDirty: (isDirty: boolean) =>
      dispatch({ type: "setIsDirty", isDirty }),
    isSaving: state.isSaving,
    setIsSaving: (isSaving: boolean) =>
      dispatch({ type: "setIsSaving", isSaving }),
    lastSavedAt: state.lastSavedAt,
    setLastSavedAt: (savedAt: string | null) =>
      dispatch({ type: "setLastSavedAt", savedAt }),
    saveError: state.saveError,
    setSaveError: (error: string | null) =>
      dispatch({ type: "setSaveError", error }),
  }
}
