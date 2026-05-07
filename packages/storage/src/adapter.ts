import type { Buffer } from "node:buffer"

export type StorageObject = {
  key: string
  url?: string
  contentType?: string
  size?: number
}

export interface StorageAdapter {
  upload(input: {
    tenantId: string
    key: string
    body: Blob | Buffer | Uint8Array | ArrayBuffer
    contentType?: string
  }): Promise<StorageObject>

  getPublicUrl(input: {
    tenantId: string
    key: string
  }): Promise<string>

  delete(input: {
    tenantId: string
    key: string
  }): Promise<void>
}