import { Component, inject, output } from '@angular/core';
import { FeaturedPropertiesComponent } from "../featured-properties/featured-properties.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoomListParams } from '../../models/room-list-params';
import { AddressService, AdminAreaResponse } from '../../services/address.service';

@Component({
  selector: 'app-properties-sidebar',
  imports: [FeaturedPropertiesComponent, ReactiveFormsModule],
  templateUrl: './properties-sidebar.component.html',
  styleUrl: './properties-sidebar.component.css'
})
export class PropertiesSidebarComponent {

  filterChange = output<RoomListParams>();
  private base: RoomListParams = {page: 0, size: 4, 
    priceMin: null, 
    priceMax: null,
    provinceCode: null,
    districtCode: null,
    communeCode: null,
    villageCode: null
  }

  private fb = inject(FormBuilder);
  private addressService = inject(AddressService);

  provinces: AdminAreaResponse[] = [];
  districts: AdminAreaResponse[] = [];
  communes: AdminAreaResponse[] = [];
  villages: AdminAreaResponse[] = [];

  constructor(){
    this.addressService.getProvinces().subscribe(list =>{
      this.provinces = list ?? [];
    })
  }

  form = this.fb.group({
    provinceCode: this.fb.control<string>(''),
    districtCode: this.fb.control<string>({value: '', disabled: true}),
    communeCode: this.fb.control<string>({value: '', disabled: true}),
    villageCode: this.fb.control<string>({value: '', disabled: true}),
    priceMin: this.fb.control<number | null> (null, {validators: [Validators.min(0)]}),
    priceMax: this.fb.control<number | null> (null, {validators: [Validators.min(0)]}),
  })

  get provinceCtrl() {
    return this.form.controls.provinceCode;
  }

  get districtCtrl() {
    return this.form.controls.districtCode;
  }

  get communeCtrl() {
    return this.form.controls.communeCode;
  }

  get villageCtrl() {
    return this.form.controls.villageCode;
  }

  onProvinceChange(code: string){
    // clear old data from other combobox
    this.districts = [];
    this.communes = [];
    this.villages = [];
    this.form.patchValue({districtCode: '', communeCode: '', villageCode: ''});

    // Enable district
    if(!code){
      this.districtCtrl.disable();
      this.communeCtrl.disable();
      this.villageCtrl.disable();
      return;
    }

    this.districtCtrl.enable();
    this.communeCtrl.disable();
    this.villageCtrl.disable();

    this.addressService.getDistricts(code).subscribe(list =>{
      this.districts = list;
    })
  }

  onDistrictChange(code: string){
    this.communes = [];
    this.villages = [];
    this.form.patchValue({communeCode: '', villageCode: ''});

    if(!code){
      this.communeCtrl.disable();
      this.villageCtrl.disable();
      return;
    }

    this.communeCtrl.enable();
    this.villageCtrl.disable();
    this.addressService.getCommunes(code)
      .subscribe(list =>{
        this.communes = list;
      });
  }

  onCommuneChange(code: string){
    this.villages = [];
    this.form.patchValue({villageCode: ''});
    if(!code){
      this.villageCtrl.disable();
      return;
    }
    this.villageCtrl.enable();
    this.addressService.getVillages(code)
      .subscribe(list =>{
        this.villages = list;
      });

  }

  applyFilter(){
    //console.log("Apply is clicked")
    //console.log(this.form.getRawValue())
    //const {priceMin, priceMax}  = this.form.getRawValue();
    //this.filterChange.emit({...this.base, priceMin: priceMin ?? null, priceMax: priceMax ?? null})

    const raw  = this.form.getRawValue();
    this.filterChange.emit({...this.base, 
      priceMin: raw.priceMin ?? null, 
      priceMax: raw.priceMax ?? null,
      provinceCode: raw.provinceCode || null,
      districtCode: raw.districtCode || null,
      communeCode: raw.communeCode || null,
      villageCode: raw.villageCode || null,
    
    })

  }
}
