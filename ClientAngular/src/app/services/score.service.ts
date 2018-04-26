import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
@Injectable()
export class ScoreService {
	
	
	constructor(private http: Http) {
	}

	getScores(username:String){
		// return this.http.get('https://servermongodb20180425101716.azurewebsites.net/api/user/' + username, {}).map((response: Response) => response.json());
		return this.http.get('https://servermongodb20180425101716.azurewebsites.net/api/user/'+username).map((response: Response) => response.json());
	}
	pushscore(username:String,score:number){
		var url = 'https://servermongodb20180425101716.azurewebsites.net/api/user/'+username+'/'+score

		//https://servermongodb20180425101716.azurewebsites.net/api/user/ravi72munde@gmail.com/1
		//return this.http.post(url,{}).map((response: Response) => response.json());
		return this.http.post(url,{}).map(res => res.json()).subscribe();
	}
}
