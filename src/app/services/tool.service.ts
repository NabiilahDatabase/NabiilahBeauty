import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ToolService {

  constructor(
    private zone: NgZone,
    private router: Router,
  ) { }

  async saveRoute(link: string) {
    this.zone.run(async () => {
      await this.router.navigate([link]);
    });
  }
}
