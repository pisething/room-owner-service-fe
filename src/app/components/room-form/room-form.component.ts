import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { AddressService, AdminAreaResponse } from '../../services/address.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { RoomMediaApiService } from '../../services/room-media-api.service';

type RoomType = 'SINGLE' | 'DOUBLE' | 'STUDIO';
type PropertyType = 'APARTMENT' | 'HOUSE' | 'CONDO' | 'TOWNHOUSE' | 'COMMERCIAL';
type GenderPreference = 'MALE' | 'FEMALE' | 'NO_PREFERENCE';
type RoomStatus = 'AVAILABLE' | 'RENTED' | 'HIDDEN';

@Component({
  selector: 'app-room-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './room-form.component.html'
})
export class RoomFormComponent {
  private fb = inject(FormBuilder);
  private addressService = inject(AddressService);
  private destroyRef = inject(DestroyRef); // good to have
  private router = inject(Router);
  private mediaApi = inject(RoomMediaApiService);


  // Signals (Angular 19)
  mode = input<'create' | 'update'>('create');
  value = input<any | null>(null); 
  create = output<any>();
  update = output<{ id: string; body: any }>();

  // dropdown data
  currencies = ['USD', 'KHR'];
  roomTypes: RoomType[] = ['SINGLE', 'DOUBLE', 'STUDIO'];
  propertyTypes: PropertyType[] = ['APARTMENT', 'HOUSE', 'CONDO', 'TOWNHOUSE', 'COMMERCIAL'];
  genderPrefs: GenderPreference[] = ['MALE', 'FEMALE', 'NO_PREFERENCE'];
  statuses: RoomStatus[] = ['AVAILABLE', 'RENTED', 'HIDDEN'];

  // ---------- Image Upload State ----------
uploading = false;
uploadError: string | null = null;

selectedFiles: File[] = [];
selectedPreviews: string[] = [];

// URLs returned from backend (MinIO / S3)
photoUrlsView: string[] = [];


  // address reference lists (bound in template with @for)
  provinces: Array<{ code: string; nameEn: string }> = [];
  districts: Array<{ code: string; nameEn: string }> = [];
  communes: Array<{ code: string; nameEn: string }> = [];
  //villages: Array<{ code: string; nameEn: string }> = [];
  villages: AdminAreaResponse[] = [];
  submitted = false;

  // --- Reactive Form (ALL fields) ---
  form: FormGroup = this.fb.group({
    // identifiers & audit (disabled)
    id: [{ value: '', disabled: true }],
    ownerId: ['', Validators.required],

    name: ['', Validators.required],
    description: [''],

    price: [null, [Validators.required, Validators.min(0.01)]],
    currencyCode: ['USD', Validators.required],

    floor: [null],
    roomSize: [null],
    roomType: [null as RoomType | null, Validators.required],
    propertyType: [null as PropertyType | null, Validators.required],

    // Address
    address: this.fb.group({
      provinceCode: [''],
      districtCode: [{ value: '', disabled: true }],
      communeCode: [{ value: '', disabled: true }],
      villageCode: [{ value: '', disabled: true }],

      provinceName: [''],
      districtName: [''],
      communeName: [''],
      villageName: [''],

      line1: [''],
      line2: [''],
      postalCode: [''],

      nearbyLandmarks: this.fb.array<FormControl<string>>([]),

      geo: this.fb.group({
        latitude: [null],
        longitude: [null],
      })
    }),

    // Amenities
    hasFan: [false],
    hasAirConditioner: [false],
    hasParking: [false],
    hasPrivateBathroom: [false],
    hasBalcony: [false],
    hasKitchen: [false],
    hasFridge: [false],
    hasWashingMachine: [false],
    hasTV: [false],
    hasWiFi: [false],
    hasElevator: [false],

    // Room rules
    maxOccupants: [null],
    isPetFriendly: [false],
    isSmokingAllowed: [false],
    isSharedRoom: [false],
    genderPreference: ['NO_PREFERENCE' as GenderPreference],

    // Additional info
    distanceToCenter: [null],
    isUtilityIncluded: [false],
    depositRequired: [false],
    depositAmount: [{ value: null, disabled: true }],
    minStayMonths: [null],
    contactPhone: ['', Validators.required],

    // Media
    photoUrls: this.fb.array<FormControl<string>>([]),
    videoUrl: [''],
    verifiedListing: [false],

    // Availability
    status: ['AVAILABLE' as RoomStatus, Validators.required],
    availableFrom: [''],
    availableTo: [''],

    // Audit (disabled)
    createdAt: [{ value: '', disabled: true }],
    updatedAt: [{ value: '', disabled: true }],
    createdBy: [{ value: '', disabled: true }],
    updatedBy: [{ value: '', disabled: true }],

    // Flexible extension as JSON text (convert on submit)
    extraAttributesText: ['{}']
  });

  // Convenience getters
  get addr(): FormGroup { return this.form.get('address') as FormGroup; }
  get geo(): FormGroup { return this.addr.get('geo') as FormGroup; }
  get landmarks(): FormArray<FormControl<string>> { return this.addr.get('nearbyLandmarks') as FormArray<FormControl<string>>; }
  //get photos(): FormArray<FormControl<string>> { return this.form.get('photoUrls') as FormArray<FormControl<string>>; }

  // ---------- lifecycle ----------
  ngOnInit() {
  // 1) Load provinces once
  this.addressService.getProvinces()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(list => this.provinces = list);

  // 2) deposit toggle
  this.form.get('depositRequired')?.valueChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((req: boolean) => {
      const amt = this.form.get('depositAmount');
      if (req) {
        amt?.enable();
      } else {
        amt?.disable();
        amt?.setValue(null);
      }
    });

  // grab address controls once
  const provinceCtrl = this.addr.get('provinceCode') as FormControl<string | null>;
  const districtCtrl = this.addr.get('districtCode') as FormControl<string | null>;
  const communeCtrl  = this.addr.get('communeCode')  as FormControl<string | null>;
  const villageCtrl  = this.addr.get('villageCode')  as FormControl<string | null>;

  // 3) province → districts
  provinceCtrl.valueChanges
    .pipe(
      startWith(provinceCtrl.value ?? ''),
      tap((code) => {
        districtCtrl.enable();
        communeCtrl.disable();
        villageCtrl.disable();

        districtCtrl.setValue('',{ emitEvent: false });
        communeCtrl.setValue('', { emitEvent: false });
        villageCtrl.setValue('', { emitEvent: false });

        this.communes = [];
        this.villages = [];

        // set provinceName from provinces list
        const selected = this.provinces.find(p => p.code === code);
        this.addr.patchValue(
          { provinceName: selected?.nameEn ?? '' },
          { emitEvent: false }
        );
      }),
      switchMap(code => code ? this.addressService.getDistricts(code) : of([])),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe(list => this.districts = list);

  // 4) district → communes
  districtCtrl.valueChanges
    .pipe(
      startWith(districtCtrl.value ?? ''),
      tap((code) => {
        communeCtrl.enable();
        villageCtrl.disable();

        communeCtrl.setValue('', { emitEvent: false });
        villageCtrl.setValue('', { emitEvent: false });

        this.villages = [];

        // set districtName from current districts list
        const selected = this.districts.find(d => d.code === code);
        this.addr.patchValue(
          { districtName: selected?.nameEn ?? '' },
          { emitEvent: false }
        );

      }),
      switchMap(code => code ? this.addressService.getCommunes(code) : of([])),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe(list => this.communes = list);

  // 5) commune → villages
  communeCtrl.valueChanges
    .pipe(
      startWith(communeCtrl.value ?? ''),
      tap((code) => {
        villageCtrl.enable();
        villageCtrl.setValue('', { emitEvent: false });

        // set communeName from current communes list
        const selected = this.communes.find(c => c.code === code);
        this.addr.patchValue(
          { communeName: selected?.nameEn ?? '' },
          { emitEvent: false }
        );

      }),
      switchMap(code => code ? this.addressService.getVillages(code) : of([])),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe(list => this.villages = list);

  // 6) village → set villageName
  villageCtrl.valueChanges
    .pipe(
      startWith(villageCtrl.value ?? ''),
      tap(code => {
        const selected = this.villages.find(v => v.code === code);
        this.addr.patchValue(
          { villageName: selected?.nameEn ?? '' },
          { emitEvent: false }
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe();    
  

  // 7) patch if update mode
  if (this.mode() === 'update' && this.value()) {
    this.patchAll(this.value()!);
    this.photoUrlsView = (this.value()!.photoUrls ?? []).slice();
  }
}


  // ---------- Arrays helpers ----------
  addLandmark(v = '') {
    this.landmarks.push(this.fb.nonNullable.control<string>(v));
  }
  removeLandmark(i: number) { this.landmarks.removeAt(i); }



  // ---------- Patch for update (no awaits) ----------
  patchAll(room: any) {
    // arrays first
    //(room.photoUrls ?? []).forEach((u: string) => this.addPhoto(u));
    (room.address?.nearbyLandmarks ?? []).forEach((l: string) => this.addLandmark(l));

    // set address codes — valueChanges streams above will fetch lists reactively
    this.addr.patchValue({
      provinceCode: room.address?.provinceCode ?? '',
      districtCode: room.address?.districtCode ?? '',
      communeCode:  room.address?.communeCode  ?? '',
      villageCode:  room.address?.villageCode  ?? '',

      provinceName: room.address?.provinceName ?? '',
      districtName: room.address?.districtName ?? '',
      communeName:  room.address?.communeName  ?? '',
      villageName:  room.address?.villageName  ?? '',

      line1: room.address?.line1 ?? '',
      line2: room.address?.line2 ?? '',
      postalCode: room.address?.postalCode ?? '',
      geo: {
        latitude: room.address?.geo?.latitude ?? null,
        longitude: room.address?.geo?.longitude ?? null
      }
    }, { emitEvent: true });

    // rest
    this.form.patchValue({
      id: room.id ?? '',
      ownerId: room.ownerId ?? '',
      name: room.name ?? '',
      description: room.description ?? '',

      price: room.price ?? null,
      currencyCode: room.currencyCode ?? 'USD',

      floor: room.floor ?? null,
      roomSize: room.roomSize ?? null,
      roomType: room.roomType ?? null,
      propertyType: room.propertyType ?? null,

      hasFan: room.hasFan ?? false,
      hasAirConditioner: room.hasAirConditioner ?? false,
      hasParking: room.hasParking ?? false,
      hasPrivateBathroom: room.hasPrivateBathroom ?? false,
      hasBalcony: room.hasBalcony ?? false,
      hasKitchen: room.hasKitchen ?? false,
      hasFridge: room.hasFridge ?? false,
      hasWashingMachine: room.hasWashingMachine ?? false,
      hasTV: room.hasTV ?? false,
      hasWiFi: room.hasWiFi ?? false,
      hasElevator: room.hasElevator ?? false,

      maxOccupants: room.maxOccupants ?? null,
      isPetFriendly: room.isPetFriendly ?? false,
      isSmokingAllowed: room.isSmokingAllowed ?? false,
      isSharedRoom: room.isSharedRoom ?? false,
      genderPreference: room.genderPreference ?? 'ANY',

      distanceToCenter: room.distanceToCenter ?? null,
      isUtilityIncluded: room.isUtilityIncluded ?? false,
      depositRequired: room.depositRequired ?? false,
      depositAmount: room.depositAmount ?? null,
      minStayMonths: room.minStayMonths ?? null,
      contactPhone: room.contactPhone ?? '',

      videoUrl: room.videoUrl ?? '',
      verifiedListing: room.verifiedListing ?? false,

      status: room.status ?? 'AVAILABLE',
      availableFrom: room.availableFrom ?? '',
      availableTo: room.availableTo ?? '',

      createdAt: room.createdAt ?? '',
      updatedAt: room.updatedAt ?? '',
      createdBy: room.createdBy ?? '',
      updatedBy: room.updatedBy ?? '',

      extraAttributesText: room.extraAttributes ? JSON.stringify(room.extraAttributes, null, 2) : '{}'
    }, { emitEvent: false });

    // sync deposit enable
    const req = this.form.get('depositRequired')?.value as boolean;
    if (req) { this.form.get('depositAmount')?.enable(); }
  }

  isInvalid(path: string): boolean {
    const ctrl = this.form.get(path);
    return !!ctrl && ctrl.invalid && (ctrl.touched || this.submitted);
  }

  goBack(){
    this.router.navigate(['/rooms']);
  }

  // ---------- Submit ----------
  submit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();

    // parse extraAttributes JSON safely
    let extraAttributes: Record<string, any> = {};
    try {
      extraAttributes = raw.extraAttributesText ? JSON.parse(raw.extraAttributesText) : {};
    } catch {
      extraAttributes = {};
    }

    const body = { // payload
      id: raw.id || undefined,
      ownerId: raw.ownerId,

      name: raw.name,
      description: raw.description || null,

      price: raw.price ?? null,
      currencyCode: raw.currencyCode,

      floor: raw.floor ?? null,
      roomSize: raw.roomSize ?? null,
      roomType: raw.roomType,
      propertyType: raw.propertyType,

      address: {
        provinceCode: raw.address?.provinceCode || null,
        districtCode:  raw.address?.districtCode  || null,
        communeCode:   raw.address?.communeCode   || null,
        villageCode:   raw.address?.villageCode   || null,

        provinceName: raw.address?.provinceName || null,
        districtName: raw.address?.districtName || null,
        communeName:  raw.address?.communeName  || null,
        villageName:  raw.address?.villageName  || null,

        line1: raw.address?.line1 || null,
        line2: raw.address?.line2 || null,
        postalCode: raw.address?.postalCode || null,

        nearbyLandmarks: (raw.address?.nearbyLandmarks ?? []).filter((s: string) => !!s?.trim()),
        geo: {
          latitude: raw.address?.geo?.latitude ?? null,
          longitude: raw.address?.geo?.longitude ?? null,
        }
      },

      hasFan: !!raw.hasFan,
      hasAirConditioner: !!raw.hasAirConditioner,
      hasParking: !!raw.hasParking,
      hasPrivateBathroom: !!raw.hasPrivateBathroom,
      hasBalcony: !!raw.hasBalcony,
      hasKitchen: !!raw.hasKitchen,
      hasFridge: !!raw.hasFridge,
      hasWashingMachine: !!raw.hasWashingMachine,
      hasTV: !!raw.hasTV,
      hasWiFi: !!raw.hasWiFi,
      hasElevator: !!raw.hasElevator,

      maxOccupants: raw.maxOccupants ?? null,
      isPetFriendly: !!raw.isPetFriendly,
      isSmokingAllowed: !!raw.isSmokingAllowed,
      isSharedRoom: !!raw.isSharedRoom,
      genderPreference: raw.genderPreference,

      distanceToCenter: raw.distanceToCenter ?? null,
      isUtilityIncluded: !!raw.isUtilityIncluded,
      depositRequired: !!raw.depositRequired,
      depositAmount: raw.depositRequired ? (raw.depositAmount ?? 0) : null,
      minStayMonths: raw.minStayMonths ?? null,
      contactPhone: raw.contactPhone,

      //photoUrls: (raw.photoUrls ?? []).filter((s: string) => !!s?.trim()),
      videoUrl: raw.videoUrl || null,
      verifiedListing: !!raw.verifiedListing,

      status: raw.status,
      availableFrom: raw.availableFrom || null,
      availableTo: raw.availableTo || null,

      extraAttributes,

      createdAt: raw.createdAt || null,
      updatedAt: raw.updatedAt || null,
      createdBy: raw.createdBy || null,
      updatedBy: raw.updatedBy || null
    };

    if (this.mode() === 'create') {
      this.create.emit(body);
    } else if (this.mode() === 'update' && this.value()?.id) {
      this.update.emit({ id: this.value()!.id, body });
    }
    console.log(body);
  }

  get roomId(): string | null {
    const v = this.value();
    if (v?.id) {
      return String(v.id);
    }

    const raw = this.form.getRawValue();
    return raw?.id ? String(raw.id) : null;
  }


  onFilesSelected(event: Event) {
  this.uploadError = null;

  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files ?? []);

  this.clearPreviews();

  const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
  const maxBytes = 5_000_000;

  const valid: File[] = [];
  for (const f of files) {
    if (!allowed.has(f.type)) {
      this.uploadError = 'Only JPG, PNG, WEBP are allowed.';
      continue;
    }
    if (f.size > maxBytes) {
      this.uploadError = 'File too large (max 5MB).';
      continue;
    }
    valid.push(f);
  }

  this.selectedFiles = valid;
  this.selectedPreviews = valid.map(f => URL.createObjectURL(f));
}

uploadSelected() {
  const roomId = this.value()?.id ?? this.form.getRawValue()?.id;
  if (!roomId) {
    this.uploadError = 'Create the room first, then upload photos.';
    return;
  }
  if (this.selectedFiles.length === 0) {
    this.uploadError = 'Please select at least one image.';
    return;
  }

  this.uploading = true;
  this.uploadError = null;

  this.mediaApi.uploadPhotos(roomId, this.selectedFiles)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (resp) => {
        this.photoUrlsView = (resp.photoUrls ?? []).slice();
        this.clearSelectedFiles();
        this.uploading = false;
      },
      error: (err) => {
        this.uploadError = err?.error?.detail ?? err?.message ?? 'Upload failed.';
        this.uploading = false;
      }
    });
}

deletePhotoByUrl(url: string) {
  const roomId = this.value()?.id ?? this.form.getRawValue()?.id;
  if (!roomId) {
    return;
  }

  const objectKey = this.extractObjectKey(url);
  if (!objectKey) {
    this.uploadError = 'Cannot delete photo.';
    return;
  }

  this.uploading = true;
  this.uploadError = null;

  this.mediaApi.deletePhoto(roomId, objectKey)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (resp) => {
        this.photoUrlsView = (resp.photoUrls ?? []).slice();
        this.uploading = false;
      },
      error: (err) => {
        this.uploadError = err?.error?.detail ?? err?.message ?? 'Delete failed.';
        this.uploading = false;
      }
    });
}

private extractObjectKey(url: string): string | null {
  const marker = '/room-media/';
  const idx = url.indexOf(marker);
  return idx === -1 ? null : url.substring(idx + marker.length);
}

private clearSelectedFiles() {
  this.clearPreviews();
  this.selectedFiles = [];
}

private clearPreviews() {
  for (const p of this.selectedPreviews) {
    try { URL.revokeObjectURL(p); } catch {}
  }
  this.selectedPreviews = [];
}

}