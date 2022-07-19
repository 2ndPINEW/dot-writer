/**
 * ApiError時の返り値の型
 */
export interface ApiError {
  error_code: string
  error_title?: string
  error_message?: string
}

/**
 * ApiErrorかどうか判定するための型ガード
 */
export function isApiError (arg: any): arg is ApiError {
  return 'error_code' in arg
}

export interface ApiOptions{
  error_handling?: boolean
}