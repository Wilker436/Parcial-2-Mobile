  import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
  import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonInput } from '@ionic/angular/standalone';
  import { ContactService } from 'src/app/core/services/contact.service';
  import { Contact } from 'src/app/interfaces/contact.model';
  import { Router } from '@angular/router';

  @Component({
    selector: 'app-add-contact',
    templateUrl: './add-contact.page.html',
    styleUrls: ['./add-contact.page.scss'],
    standalone: true,
    imports: [IonButton, IonLabel, IonItem, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonInput]
  })
  export class AddContactPage implements OnInit {

    constructor(
      private contactService: ContactService,
      private router: Router
    ) { }

    ngOnInit() {
    }

    form = new FormGroup({
      name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
    });

      onSubmit() {
      if (this.form.valid) {
        const formValue = this.form.value;

            const contact: Contact = {
              name: formValue.name ?? '',
              number: Number(formValue.phone)
            };

            this.contactService.addContact(contact).then(() => {
              console.log('Contacto agregado con éxito');
              this.router.navigate(['/home']);
            }).catch(error => {
              console.error('Error al agregar contacto', error);
            });
      }
    }

  }
