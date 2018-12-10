import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { TNodeService } from '../t-node.service';
import { environment } from '../../../environments/environment';
import { NzMessageService, UploadFile, UploadFilter } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';

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

  constructor(
    private nodeService: TNodeService,
    private http: HttpClient,
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

  alert() {
    console.log('滚动鼠标到下方查看');
  }


}
