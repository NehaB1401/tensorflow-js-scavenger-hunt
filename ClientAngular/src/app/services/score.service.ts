import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
@Injectable()
export class ScoreService {
	
	
	constructor(private http: Http) {
	}

	getScores(username:String){
		return this.http.get('http://tesnorflowjs.us-east-2.elasticbeanstalk.com/api/user/' + username, {}).map((response: Response) => response.json());
	}
}
