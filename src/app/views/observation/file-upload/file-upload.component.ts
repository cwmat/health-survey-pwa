import { Component, EventEmitter, Output } from '@angular/core';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { ObservationMediaDto } from 'src/app/_shared/models/observation.model';
import { UserMessages } from 'src/app/_shared/models/user-messages.model';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  // Config
  files: File[] = [];
  maxAllowableSize = 2.5e+7;
  currentSize = 0;

  // Outputs
  @Output() error: EventEmitter<string> = new EventEmitter();
  @Output() newData: EventEmitter<ObservationMediaDto[]> = new EventEmitter();

	onSelect(event: NgxDropzoneChangeEvent) {
		console.log(event);
    let loadSize = event.addedFiles.reduce((a: any, b: any) => {
      return a + b['size'];
    }, 0);
    loadSize += this.currentSize;

    if (loadSize <= this.maxAllowableSize) {
      this.files.push(...event.addedFiles);
      this.currentSize = loadSize;
    } else {

      console.log(UserMessages.UploadTooLarge);
      this.errorOccured(UserMessages.UploadTooLarge);
    }

    if (event.rejectedFiles?.length > 0) {
      console.log(UserMessages.UploadWrongType);
      this.errorOccured(UserMessages.UploadWrongType);
    }

    this.onFilesChanged();
	}

	onRemove(event: any) {
		console.log(event);
		this.files.splice(this.files.indexOf(event), 1);
    this.currentSize -= event?.size;

    this.onFilesChanged();
	}

  async onFilesChanged() {
    const tempData: ObservationMediaDto[] = [];
    for (const fileData of this.files) {
      const fileContents = await this.readFile(fileData) as string;
      tempData.push({
        FileName: fileData.name,
        File: fileContents.split("base64,")[1]
      } as ObservationMediaDto);
    }

    this.newData.emit(tempData);
  }

  private async readFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = e => {
        // @ts-ignore
        return resolve((e.target as FileReader).result);
      };
  
      reader.onerror = e => {
        console.error(`FileReader failed on file ${file.name}.`);
        return reject(null);
      };
  
      if (!file) {
        console.error('No file to read.');
        return reject(null);
      }
  
      reader.readAsDataURL(file);
    });
  }

  public fileToBase64 = (file:File):Promise<string> => {
    return new Promise<string> ((resolve,reject)=> {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          // @ts-ignore
          reader.onload = () => resolve(reader.result.toString());
          reader.onerror = error => reject(error);
      })
  }

  private errorOccured(message: string) {
    this.error.emit(message);
  }

}
