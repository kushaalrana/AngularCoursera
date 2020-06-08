import { Injectable } from '@angular/core';
import {Leader} from '../shared/leader';
import {LEADERS} from '../shared/leaders';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }

  getLeader(): Promise<Leader[]> 
  {
    return Promise.resolve(LEADERS);
  }
  getFeatureid(id: string): Promise<Leader>
  {
    return Promise.resolve(LEADERS.filter((lead)=>(lead.id === id))[0]);
  }
  getFeatured(): Promise<Leader>
  {
    return Promise.resolve(LEADERS.filter((lead)=>lead.featured)[0]);
  }
}

