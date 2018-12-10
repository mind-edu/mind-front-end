import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {SNodeService} from '../s-node.service';

@Component({
  selector: 'app-s-courseware',
  templateUrl: './s-courseware.component.html',
  styleUrls: ['./s-courseware.component.css']
})
export class SCoursewareComponent implements OnInit, OnChanges {

  @Input() course_id: string; // 与上层组件中course绑定
  @Input() mind_id: string; // 与上层组件中选中的mindMap绑定
  @Input() node_id: string;

  courseware_names: string[] = [];

  constructor(
    private nodeService: SNodeService
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.updateCoursewares();
  }

  updateCoursewares() {
    this.nodeService.getCoursewares(this.course_id, this.mind_id, this.node_id).subscribe(r => {
      this.courseware_names = r;
    });
  }

  download(file_name: string) {
    this.nodeService.requestCoursewareBlob(
      this.course_id, this.mind_id, this.node_id, file_name).subscribe(r => {

      this.nodeService.downFile(r, file_name);
    });
  }

}
