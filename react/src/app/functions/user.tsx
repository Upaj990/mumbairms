import axios from 'axios';
import { BASE_URL,PATH } from '../api';

export default async function user(callback:any) {
    const token = await localStorage.getItem('@TOKEN');
    return new Promise((resolve, reject) => {
        const config:any = {
            method: 'post',
            url: BASE_URL+PATH.ADMIN_DETAILS,
            headers: { 
                'Authorization': token
            }
        };
        return axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            if(response.data.status){
                callback(response.data.data)
            }else{
                console.log(response.data?.message)
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    })
}