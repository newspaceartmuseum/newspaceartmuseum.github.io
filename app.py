from flask import Flask, request, jsonify
import json
import os
from datetime import datetime

app = Flask(__name__)

# 确保数据目录存在
DATA_DIR = 'form_data'
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

@app.route('/submit_form', methods=['POST'])
def submit_form():
    try:
        # 获取表单数据
        data = request.form.to_dict()
        
        # 添加时间戳
        data['timestamp'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # 生成唯一文件名
        filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{hash(json.dumps(data))}.json"
        file_path = os.path.join(DATA_DIR, filename)
        
        # 保存数据到JSON文件
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        
        print(f"表单数据已保存: {file_path}")
        return jsonify({"status": "success", "message": "表单提交成功"}), 200
    
    except Exception as e:
        print(f"错误: {str(e)}")
        return jsonify({"status": "error", "message": "表单提交失败"}), 500

if __name__ == '__main__':
    app.run(debug=True)
