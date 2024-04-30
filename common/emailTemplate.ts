export class EmailTemplate {
    static async getContactUsTemplate(data:any) {
        return`<div class="container">
        <h2>New Contact Form Submission</h2>
        <p class="field">Name:</p>
        <p>${data.name}</p>
        <p class="field">Company:</p>
        <p>${data.company}</p>
        <p class="field">Email:</p>
        <p>${data.email}</p>
        <p class="field">Phone:</p>
        <p>${data.phone}</p>
        <p class="field">Message:</p>
        <p>${data.message}</p>
    </div>
     `;
        
        
    }
}