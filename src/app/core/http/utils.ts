import { HttpParams } from "@angular/common/http";

export function buildParams<T extends object>(input?: T): HttpParams{
    let params = new HttpParams();

    if(!input){
        return params;
    }

    for( const [key, value] of Object.entries(input)){
        if(value == null || value === ''){
            continue;
        }
        if(Array.isArray(input)){
            for(const item of value){
                params = params.append(key, String(item));
            }
        } else{
            params = params.set(key, String(value));
        }
    }
    return params;
}