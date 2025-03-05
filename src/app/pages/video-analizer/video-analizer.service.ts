import { Injectable } from '@angular/core';
import { Endpoints } from 'src/app/core/enums';
import { HttpService } from 'src/app/services/http.service';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class VideoAnalizerService {
  constructor(private httpService: HttpService) {}

  public startAnalyzeVideo(url: string) {
    return this.httpService.postDataToService('api/video-analizer', { url }, 'python');
  }

  public extractInfo(urls: string[]) {
    return this.httpService.postDataToService('api/video-analizer/extract-tiktok-data', { urls }, 'python');
  }

  public downloadYoutubeVideo(url: string, options: { video: boolean; audio: boolean; vocals: boolean }) {
    return this.httpService.receiveFileWithProgress('api/video-analizer/download-youtube-video', { url, options }, 'python');
  }

  /**
   * Downloads a file using the browser's download capabilities
   * @param url YouTube URL to download
   * @param options Download options
   * @param filename Optional filename to use for the download (without extension)
   * @returns Observable with download progress
   */
  public downloadYoutubeVideoAndSave(
    url: string,
    options: { video: boolean; audio: boolean; vocals: boolean },
    filename?: string
  ): Observable<{ progress?: number }> {
    const downloadObs = this.downloadYoutubeVideo(url, options);

    // Create an observable that will handle the download and saving
    return new Observable<{ progress?: number }>(observer => {
      downloadObs.subscribe({
        next: data => {
          // If we have progress data, emit it
          if (data.progress !== undefined) {
            observer.next({ progress: data.progress });
          }

          // If we have the blob, save it
          if (data.blob) {
            // Determine file type and extension
            let fileExtension = '.mp4';
            let fileType = 'video/mp4';

            if (!options.video && options.audio) {
              fileExtension = '.mp3';
              fileType = 'audio/mpeg';
            }

            // Create a default filename if none provided
            const defaultFilename = filename || `youtube_download_${new Date().getTime()}`;
            const finalFilename = `${defaultFilename}${fileExtension}`;

            // Create a download link and trigger it
            this.saveFile(data.blob, finalFilename, fileType);

            observer.next({ progress: 100 });
            observer.complete();
          }
        },
        error: err => {
          observer.error(err);
        },
      });
    });
  }

  /**
   * Helper method to save a blob as a file using the browser's download capabilities
   * @param blob The blob to save
   * @param filename The filename to use
   * @param fileType The MIME type of the file
   */
  private saveFile(blob: Blob, filename: string, fileType: string): void {
    // Create a blob URL
    const blobUrl = URL.createObjectURL(new Blob([blob], { type: fileType }));

    // Create a temporary link element
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = filename;

    // Append to the document, click it, and remove it
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(blobUrl);
    }, 100);
  }
}
