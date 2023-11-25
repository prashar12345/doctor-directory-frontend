import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class BehaviorService {
    specilityId = new BehaviorSubject<any>('')
    public userData: BehaviorSubject<object> = new BehaviorSubject<object>({});
    public latLng: BehaviorSubject<object> = new BehaviorSubject<object>({});

    rootUrl: string = environment.url;
    constructor() { }

    setUserData(data) {
        this.userData.next(data);
    }

    getUserData() {
        return this.userData.asObservable();
    }

    closeModal() {
        document.getElementById("body").classList.remove("modal-open");
    }

    openModal() {
        document.getElementById("body").className = "modal-open";
    }

    setLatLng(obj) {
        let latLng: object;
        localStorage.setItem("latLng", JSON.stringify(obj));
        let latLngObject = { lat: obj.lat, lng: obj.lng };
        this.latLng.next(latLngObject);
        return {};
    }
}
