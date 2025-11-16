import { Component } from '@angular/core';
import { PropertyGalleryComponent } from "../property-gallery/property-gallery.component";
import { PropertyDescriptionComponent } from "../property-description/property-description.component";
import { PropertyAmenitiesComponent } from "../property-amenities/property-amenities.component";
import { PropertyMapComponent } from "../property-map/property-map.component";
import { PropertyOverviewComponent } from "../property-overview/property-overview.component";

@Component({
  selector: 'app-property-details',
  imports: [PropertyGalleryComponent, 
    PropertyDescriptionComponent, 
    PropertyAmenitiesComponent, 
    PropertyMapComponent, 
    PropertyOverviewComponent],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.css'
})
export class PropertyDetailsComponent {

}
