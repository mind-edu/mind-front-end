import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as jsMind from '../../../assets/jsmind/jsmind';
import {SMindmapService} from '../s-mindmap.service';

const options = {
  container: 'jsmind_container',
  theme: 'greensea',
  editable: true
};


@Component({
  selector: 'app-s-mindmap',
  templateUrl: './s-mindmap.component.html',
  styleUrls: ['./s-mindmap.component.css']
})
export class SMindmapComponent implements OnInit {

  course_id: string;
  @Input()
  set courseId(course_id: string) {
    this.course_id = course_id;
  }

  mindmap_id: string;
  @Input()
  set mindmapId(mindmap_id: string) {
    this.mindmap_id = mindmap_id;
    // console.log(mindmap_id);

    if (this.mindmap_id) {
      this.updateMindmapView();
    }
  }

  mindStr: any;

  public mindMap; // 思维导图组件

  selected_node_id: string; // 当前思维导图中被选中的节点
  @Output() selectNodeEvent = new EventEmitter<string>();
  selected_node;

  constructor(
    private mindmapService: SMindmapService
  ) { }

  ngOnInit() {
    this.selected_node_id = '';
  }

  // 显示新的mindMap
  updateMindmapView() {

    this.mindmapService.getMindmap(this.course_id, this.mindmap_id).subscribe(mindStr => {

      this.mindStr = mindStr;

      if (!this.mindMap) {
        this.mindMap = jsMind.show(options, this.mindStr);
        this.mindMap.disable_edit();
      } else {
        this.mindMap.show(this.mindStr);
      }

    });
  }

  update_selected_knowledge_id(): void {

    if (!this.mindMap) {
      return;
    }

    this.selected_node = this.mindMap.get_selected_node();
    if (!this.selected_node) {
      this.selected_node_id = '';
    } else {
      this.selected_node_id = this.selected_node.id;
    }
    this.selectNodeEvent.emit(this.selected_node_id); // 向上发射选中节点事件

    window.sessionStorage.setItem('node_id', this.selected_node_id);
  }

  screen_shot() {
    this.mindMap.screenshot.shootDownload();
  }

}
