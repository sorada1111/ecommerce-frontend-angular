import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SpFormService } from '../../services/sp-form.service';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private spFormService: SpFormService
  ) {}

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    //populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log(`startMonth: ` + startMonth);

    this.spFormService.getCreditCardMonths(startMonth).subscribe((data) => {
      console.log(`Retrieved credit card months:` + JSON.stringify(data));
      this.creditCardMonths = data;
    });

    //populate credit card years
    this.spFormService.getCreditCardYear().subscribe((data) => {
      console.log(`Retrived credit card years: ` + JSON.stringify(data));
      this.creditCardYears = data;
    });

    //populate countries
    this.spFormService.getCountries().subscribe((data) => {
      console.log(`Retrived countries: ` + JSON.stringify(data));
      this.countries = data;
    });
  }

  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );

      // bug fix for states
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      // bug fix for states
      this.billingAddressStates = [];
    }
  }

  onSubmit() {
    console.log(`Handling form submission button`);
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log(
      'The email address is ' +
        this.checkoutFormGroup.get('customer').value.email
    );

    console.log(
      'The shipping address country is ' +
        this.checkoutFormGroup.get('shippingAddress').value.country.name
    );
    console.log(
      'The shipping address state is ' +
        this.checkoutFormGroup.get('shippingAddress').value.state.name
    );
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectYear: number = Number(creditCardFormGroup.value.expirationYear);

    //If the current year equal the selected year, then start with current month
    let startMonth: number;
    if (currentYear === selectYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.spFormService.getCreditCardMonths(startMonth).subscribe((data) => {
      console.log(`Retrieved credit card months:` + JSON.stringify(data));
      this.creditCardMonths = data;
    });
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;
    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);
    this.spFormService.getStates(countryCode).subscribe((data) => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }
      //select first state as default
      formGroup.get('state').setValue(data[0]);
    });
  }
}
