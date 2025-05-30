var radius = 180; 
var dtr = Math.PI/180; 
var d=350;  

var mcList = [];
var active = false; 
var lasta = 0.8; 
var lastb = 0; 
var distr = true;
var tspeed=8; 
var size=200;

var mouseX=0;
var mouseY=0;

var howElliptical=1;

var aA=null;
var oDiv=null;

window.onload=function ()
{
	console.log("onload");
	var modal = document.getElementById('user-form-modal');
	var closeBtn = document.getElementById('close-form-btn');
	var userForm = document.getElementById('user-form');
	var thankYouMsg = document.getElementById('thank-you-message');

	// 页面加载后1秒弹窗（带动画）
	if (modal) {
		setTimeout(function() {
			modal.style.display = 'flex';
			setTimeout(function() {
				modal.classList.add('modal-visible');
			}, 10);
			if(userForm) userForm.style.display = 'block';
			if(thankYouMsg) thankYouMsg.style.display = 'none';
		}, 1000);
	}

	function hideModal() {
		if (!modal) return;
		modal.classList.remove('modal-visible');
		setTimeout(function() {
			modal.style.display = 'none';
		}, 400);
	}

	if (closeBtn && modal) {
		closeBtn.onclick = function() {
			hideModal();
		};
	}
	// 在原有的script.js文件中找到userForm的submit事件处理函数，修改为：

if (userForm && thankYouMsg && modal) {
    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 收集表单数据
        const formData = new FormData(userForm);
        const data = Object.fromEntries(formData.entries());
        
        // 显示加载状态
        const submitButton = userForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = '提交中...';
        }
        
        // 发送数据到后端
       fetch('http://localhost:5000/submit_form', {  // 完整URL（含域名和端口）
           method: 'POST',
           body: new FormData(userForm)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应失败');
            }
            return response.json();
        })
        .then(result => {
            console.log('提交结果:', result);
            // 无论成功还是失败都显示感谢信息
            userForm.style.display = 'none';
            thankYouMsg.style.display = 'block';
            
            // 2秒后关闭弹窗
            setTimeout(function() {
                hideModal();
                // 重置表单和按钮状态
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = '提交 / Submit';
                }
                userForm.reset();
            }, 2000);
        })
        .catch(error => {
            console.error('Error:', error);
            // 错误处理，可以显示错误信息给用户
            userForm.style.display = 'none';
            
            // 显示错误信息
            if (thankYouMsg) {
                thankYouMsg.innerHTML = `
                    <p>提交失败，请稍后再试。</p>
                    <p>Error: ${error.message}</p>
                `;
                thankYouMsg.style.display = 'block';
            }
            
            setTimeout(function() {
                hideModal();
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = '提交 / Submit';
                }
                userForm.reset();
            }, 3000);
        });
    });
}
	var i=0;
	var oTag=null;
	
	oDiv=document.getElementById('tagbox');
	
	aA=oDiv.getElementsByTagName('a');
	
	for(i=0;i<aA.length;i++)
	{
		oTag={};
		
		oTag.offsetWidth=aA[i].offsetWidth;
		oTag.offsetHeight=aA[i].offsetHeight;
		
		mcList.push(oTag);
	}
	
	sineCosine( 0,0,0 );
	
	positionAll();
	
	oDiv.onmouseover=function ()
	{
		active=true;
	};
	
	oDiv.onmouseout=function ()
	{
		active=false;
	};
	
	oDiv.onmousemove=function (ev)
	{
		var oEvent=window.event || ev;
		
		mouseX=oEvent.clientX-(oDiv.offsetLeft+oDiv.offsetWidth/2);
		mouseY=oEvent.clientY-(oDiv.offsetTop+oDiv.offsetHeight/2);
		
		mouseX/=5;
		mouseY/=5;
	};
	
	setInterval(update, 30);
};


function update()
{
	console.log("update");
	var a;
	var b;
	
	if(active)
	{
		a = (-Math.min( Math.max( -mouseY, -size ), size ) / radius ) * tspeed;
		b = (Math.min( Math.max( -mouseX, -size ), size ) / radius ) * tspeed;
	}
	else
	{
		a = lasta * 0.98;
		b = lastb * 0.98;
	}

	
	// lasta=a;
	// lastb=b;
	
	// if(Math.abs(a)<=0.01 && Math.abs(b)<=0.01)
	// {
		// return;
	// }
	
	var c=0;
	sineCosine(a,b,c);
	for(var j=0;j<mcList.length;j++)
	{
		var rx1=mcList[j].cx;
		var ry1=mcList[j].cy*ca+mcList[j].cz*(-sa);
		var rz1=mcList[j].cy*sa+mcList[j].cz*ca;
		
		var rx2=rx1*cb+rz1*sb;
		var ry2=ry1;
		var rz2=rx1*(-sb)+rz1*cb;
		
		var rx3=rx2*cc+ry2*(-sc);
		var ry3=rx2*sc+ry2*cc;
		var rz3=rz2;
		
		mcList[j].cx=rx3;
		mcList[j].cy=ry3;
		mcList[j].cz=rz3;
		
		per=d/(d+rz3);
		
		mcList[j].x=(howElliptical*rx3*per)-(howElliptical*2);
		mcList[j].y=ry3*per;
		mcList[j].scale=per;
		mcList[j].alpha=per;
		
		mcList[j].alpha=(mcList[j].alpha-0.6)*(10/6);
	}
	
	doPosition();
	depthSort();
}

function depthSort()
{
	var i=0;
	var aTmp=[];
	
	for(i=0;i<aA.length;i++)
	{
		aTmp.push(aA[i]);
	}
	
	aTmp.sort
	(
		function (vItem1, vItem2)
		{
			if(vItem1.cz>vItem2.cz)
			{
				return -1;
			}
			else if(vItem1.cz<vItem2.cz)
			{
				return 1;
			}
			else
			{
				return 0;
			}
		}
	);
	
	for(i=0;i<aTmp.length;i++)
	{
		aTmp[i].style.zIndex=i;
	}
}

function positionAll()
{
	var phi=0;
	var theta=0;
	var max=mcList.length;
	var i=0;
	
	var aTmp=[];
	var oFragment=document.createDocumentFragment();
	
	
	for(i=0;i<aA.length;i++)
	{
		aTmp.push(aA[i]);
	}
	
	aTmp.sort
	(
		function ()
		{
			return Math.random()<0.5?1:-1;
		}
	);
	
	for(i=0;i<aTmp.length;i++)
	{
		oFragment.appendChild(aTmp[i]);
	}
	
	oDiv.appendChild(oFragment);
	
	for( var i=1; i<max+1; i++){
		if( distr )
		{
			phi = Math.acos(-1+(2*i-1)/max);
			theta = Math.sqrt(max*Math.PI)*phi;
		}
		else
		{
			phi = Math.random()*(Math.PI);
			theta = Math.random()*(2*Math.PI);
		}
		
		mcList[i-1].cx = radius * Math.cos(theta)*Math.sin(phi);
		mcList[i-1].cy = radius * Math.sin(theta)*Math.sin(phi);
		mcList[i-1].cz = radius * Math.cos(phi);
		
		aA[i-1].style.left=mcList[i-1].cx+oDiv.offsetWidth/2-mcList[i-1].offsetWidth/2+'px';
		aA[i-1].style.top=mcList[i-1].cy+oDiv.offsetHeight/2-mcList[i-1].offsetHeight/2+'px';
	}
}

function doPosition()
{
	var l=oDiv.offsetWidth/2;
	var t=oDiv.offsetHeight/2;
	for(var i=0;i<mcList.length;i++)
	{
		aA[i].style.left=mcList[i].cx+l-mcList[i].offsetWidth/2+'px';
		aA[i].style.top=mcList[i].cy+t-mcList[i].offsetHeight/2+'px';
		
		aA[i].style.fontSize=Math.ceil(12*mcList[i].scale/2)+8+'px';
		
		aA[i].style.filter="alpha(opacity="+100*mcList[i].alpha+")";
		aA[i].style.opacity=mcList[i].alpha;
	}
}

function sineCosine( a, b, c)
{
	sa = Math.sin(a * dtr);
	ca = Math.cos(a * dtr);
	sb = Math.sin(b * dtr);
	cb = Math.cos(b * dtr);
	sc = Math.sin(c * dtr);
	cc = Math.cos(c * dtr);
}
