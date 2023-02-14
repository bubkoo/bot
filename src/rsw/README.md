**push 时**
1. dispatch event 到 host 仓库（rsw-a）
2. rsw-a 中对应的 workflow 收到 repository_dispatch 事件
   1. 执行 register 任务：在 push 的目标仓库 rsw-b 中创建一个 check_run，并将其 ID 和其他信息写入数据库
   2. 执行其他自定义任务
   3. 执行完成（workflow_run.completed）时，更新 check_run 的状态
   4. 重新执行（check_run.rerequested），出发 workflow 重新执行
