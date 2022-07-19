import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ApiError, isApiError } from './api.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
    constructor(
        private http: HttpClient
    ) { }

    /**
     * 失敗したHttp操作を処理します。
     * アプリを持続させます。
     */
    private handleError(error: any, operation: string = 'operation'): Observable<ApiError> {
        // TODO: リモート上のロギング基盤にエラーを送信する
        console.error('epi_error_default', operation, error) // かわりにconsoleに出力

        const error_obj: ApiError = {
            error_code: 'N001',
            error_title: '通信エラーが発生しました',
            error_message: '通信環境をお確かめの上再度お試しください。'
        }
    
        // 空の結果を返して、アプリを持続可能にする
        return of(error_obj)
    }

    get<T>(path: string) {
        return this.http.get<T | ApiError>(path)
            .pipe(
                catchError(e => this.handleError(e, path))
            )
            // APIエラーが返ってきた時にタイトルが空白の場合はデフォルト文言を入れる
            .pipe(
                map(v => {
                    if (isApiError(v)) {
                        v['error_title'] = v.error_title ?? 'サーバーエラーが発生しました'
                        v['error_message'] = v.error_message ?? 'しばらく待ってから再度お試しください。'
                    }
                    return v
                })
            )
    }
}
