import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import { TNodeService } from '../t-node.service';
import { environment } from '../../../environments/environment';
import { NzMessageService, UploadFile, UploadFilter } from 'ng-zorro-antd';

@Component({
  selector: 'app-t-courseware',
  templateUrl: './t-courseware.component.html',
  styleUrls: ['./t-courseware.component.css']
})
export class TCoursewareComponent implements OnInit, OnChanges {

  uploadUrl = '';

  @Input() course_id: string; // 与上层组件中course绑定
  @Input() mind_id: string; // 与上层组件中选中的mindMap绑定
  @Input() node_id: string; // 当前选中的节点

  courseware_names: string[] = []; // 记录从服务器获取的的课件资源

  filters: UploadFilter[] = [
    {
      name: 'type',
      fn  : (fileList: UploadFile[]) => {
        const filterFiles = fileList.filter(w => ~['application/pdf'].indexOf(w.type));
        if (filterFiles.length !== fileList.length) {
          this.msg.error(`包含文件格式不正确，只支持 pdf 格式`);
          return filterFiles;
        }
        return fileList;
      }
    }
  ]; // 限制课件类型

  courseware_url = ''; // 课件资源的地址
  totalPages: number;
  page = 1; // 课件预览的页码

  constructor(
    private nodeService: TNodeService,
    private msg: NzMessageService
  ) { }

  ngOnInit() {
  }

  // 信息改变则更新上传地址
  ngOnChanges() {
    this.uploadUrl = environment.apiUrl + 'upload_courseware/'
      + this.course_id + '/' + this.mind_id + '/' + this.node_id + '/';

    this.updateCoursewares();
  }

  // 从服务器更新课件列表
  updateCoursewares() {
    this.nodeService.getCoursewares(this.course_id, this.mind_id, this.node_id).subscribe(r => {
      this.courseware_names = r;
    });
  }

  // 下载课件
  download(file_name: string) {
    this.nodeService.requestCoursewareBlob(
      this.course_id, this.mind_id, this.node_id, file_name).subscribe(
        r => {
          this.nodeService.downFile(r, file_name);
        });
  }

  // 处理文件上传之后的消息
  handleChange({ file, fileList }): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.msg.success(`课件 ${file.name} 上传成功`);
    } else if (status === 'error') {
      this.msg.error(`课件 ${file.name} 上传失败`);
    }
    this.updateCoursewares();
  }

  loadCourseware(file_name: string) {
    const apiUrl =  environment.apiUrl;
    this.courseware_url = `${apiUrl}view_courseware/${this.course_id}/${this.mind_id}/${this.node_id}/${file_name}`;
    this.page = 1;
    this.msg.info('请在资源列表下方查看');
  }

  // pdf加载完成之后
  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
  }


}
