import { Injectable } from '@angular/core';
import {Leader} from '../shared/leader';
import {LEADERS} from '../shared/leaders';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }

  getLeader(): Leader[]
  {
    return LEADERS;
  }
  getFeatureid(id: string): Leader
  {
    return LEADERS.filter((lead)=>(lead.id === id))[0];
  }
  getFeatured(): Leader
  {
    return LEADERS.filter((lead)=>lead.featured)[0];
  }
}

