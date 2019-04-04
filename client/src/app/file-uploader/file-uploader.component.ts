import { Component, Input } from '@angular/core';
import { UploadService } from '../services/upload.service';
import { Attachments } from '../services/instance.service';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent {

  filesToUpload: Array<File> = [];

  attachedFiles: Attachments[] = [];

  @Input() state: string;
  isActive = true;
  constructor(private uploadService: UploadService) {
    

  }

  upload(event) {
    event.preventDefault;
    const formData: any = new FormData();
    const files: Array<File> = this.filesToUpload;
    console.log(files);

    for (let i = 0; i < files.length; i++) {
        formData.append('attachments', files[i], files[i]['name']);
    }
    this.uploadService.uploadMultipleFiles(formData)
    .then(
      data => {
        console.log(data);
        data.forEach(f => {
          this.attachedFiles.push({nomOriginal: f.originalname, path: f.path, nomReel: f.filename});

        });
        this.filesToUpload = []; // Memory leak, what's that
      })
    .catch(err => console.log(err));
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  onClick(file: Attachments) {
    this.uploadService.getFile(file);
  }

}
