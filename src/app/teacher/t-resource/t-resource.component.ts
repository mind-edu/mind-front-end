import { Component, Input, OnChanges, OnInit, TemplateRef } from '@angular/core';
import { TNodeService } from '../t-node.service';
import { environment } from '../../../environments/environment';
import { NzMessageService, NzModalRef, NzModalService, UploadFile, UploadFilter } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { Link} from '../../link';

@Component({
  selector: 'app-t-resource',
  templateUrl: './t-resource.component.html',
  styleUrls: ['./t-resource.component.css']
})
export class TResourceComponent implements OnInit, OnChanges {

  uploadUrl = '';

  @Input() course_id: string; // 与上层组件中course绑定
  @Input() mind_id: string; // 与上层组件中选中的mindMap绑定
  @Input() node_id: string;

  material_names: string[] = [];
  links: any[];
  link: Link = new Link();

  tplModal: NzModalRef;

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
  ];

  // tslint:disable-next-line:typedef
  handleChange({ file, fileList }): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.msg.success(`${file.name} 文件上传成功`);
    } else if (status === 'error') {
      this.msg.error(`${file.name} 文件上传失败`);
    }
    this.updateResources();
  }

  constructor(
    private nodeService: TNodeService,
    private http: HttpClient,
    private msg: NzMessageService,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.uploadUrl = environment.apiUrl + 'upload_material/'
      + this.course_id + '/' + this.mind_id + '/' + this.node_id + '/';

    this.updateMaterials();
    this.updateLinks();
  }

  updateMaterials() {
    this.nodeService.getMaterials(this.course_id, this.mind_id, this.node_id).subscribe(r => {
      this.material_names = r;
    });
  }

  download(file_name: string) {
    this.nodeService.requestMaterialBlob(
      this.course_id, this.mind_id, this.node_id, file_name).subscribe(r => {

      this.nodeService.downFile(r, file_name);
    });
  }

  updateLinks() {
    this.nodeService.getLinks(
      this.course_id,
      this.mind_id,
      this.node_id).subscribe(
      value => this.setLinkAddrs(value));
  }

  updateResources() {
    this.updateLinks();
    this.updateMaterials();
  }

  setLinkAddrs(value) {
    this.links = value;
  }

  openLinkModal(
    tplTitle: TemplateRef<{}>,
    tplContent: TemplateRef<{}>,
    tplFooter: TemplateRef<{}>
  ) {
    this.tplModal = this.modalService.create({
      nzTitle: tplTitle,
      nzContent: tplContent,
      nzFooter: tplFooter,
      nzMaskClosable: false
    });
  }

  uploadLink() {
    console.log('hello world');
    this.nodeService.upload_link(
      this.course_id,
      this.mind_id,
      this.node_id,
      this.link).subscribe(
      value => {
        this.checkLink(value['success']);
        this.tplModal.destroy();
      });
  }

  checkLink(value) {
    if (value) {
      this.updateLinks();
      this.msg.success('上传成功');
      this.link = new Link();
    }
  }

}
