const formToJSON = elements => [].reduce.call(elements, (data, element) => {
	if(element.name != 'dummy') {
		data[element.name] = element.value;
		return data;
	}
	return data;
}, {});

var SignUp = () => {
	const form = document.getElementsByClassName('signupform')[0];
	const data = formToJSON(form.elements);
	var xhttp = new XMLHttpRequest();
	var url = '/users/signup';
	xhttp.onreadystatechange = () => {
		if (xhttp.readyState == 4) {
			var res = JSON.parse(xhttp.response);
			document.getElementsByClassName("result")[0].style.color = "red";
			document.getElementsByClassName("result")[0].innerHTML = res.status;
			document.getElementsByClassName("result")[0].style.visibility = "visible";
			if(res.success == true) {
				document.getElementsByClassName("result")[0].style.color = "green";
				setTimeout(() => { LoginShift(); }, 2000);
			}
		}
	};
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(data));
};

var Login = () => {
	const form = document.getElementsByClassName('loginform')[0];
	const data = formToJSON(form.elements);
	var xhttp = new XMLHttpRequest();
	var url = '/users/login';
	xhttp.onreadystatechange = () => {
		if (xhttp.readyState == 4) {
			var res = JSON.parse(xhttp.response);
			if(res.success == false) {
				document.getElementsByClassName("result")[0].style.color = "red";
				document.getElementsByClassName("result")[0].innerHTML = res.status;
				document.getElementsByClassName("result")[0].style.visibility = "visible";
			}
			else {
				window.location.href = '/home';
			}
		}
	};
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(data));
};

var Logout = () => {
	var xhttp = new XMLHttpRequest();
	var url = '/users/logout';
	xhttp.onreadystatechange = () => {
		if (xhttp.readyState == 4) {
			var res = JSON.parse(xhttp.response);
			if(res.success == true) {
				window.location.href = '../?info=200';
			}
			else {
				window.location.href = '../';
			}
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
};

var error = () => {
	var info = window.location.search.substr(6);
	if(info == "403") {
		document.getElementsByClassName("result")[0].style.color = "red";
		document.getElementsByClassName("result")[0].innerHTML = "Unauthorized. Status 403.";
		document.getElementsByClassName("result")[0].style.visibility = "visible";
	}
	if(info == "200") {
		document.getElementsByClassName("result")[0].innerHTML = "Logout Successful!";
		document.getElementsByClassName("result")[0].style.visibility = "visible";
		document.getElementsByClassName("result")[0].style.color = "green";
	}
	history.replaceState && history.replaceState(
		null, '', location.pathname + location.search.replace(/[\?&]info=[^&]+/, '').replace(/^&/, '?') + location.hash
		);
}

var SignUpShift = () => {
	document.getElementsByClassName('login')[0].classList.add('login-deactive');
	document.getElementsByClassName('signup')[0].classList.add('signup-active');
	document.getElementsByClassName("result")[0].style.visibility = "hidden";
}

var LoginShift = () => {
	document.getElementsByClassName('login')[0].classList.remove('login-deactive');
	document.getElementsByClassName('signup')[0].classList.remove('signup-active');
	document.getElementsByClassName("result")[0].style.visibility = "hidden";
}

var Profile = () => {
	var classone = document.getElementsByClassName("profile");
	var classtwo = document.getElementsByClassName("editor");
	document.getElementsByClassName("profiletab")[0].classList.add("activetab");
	classtwo[0].style.display = "none";
	classtwo[1].style.display = "none";
	classtwo[0].classList.remove("active");
	classtwo[1].classList.remove("active");
	classone[0].style.display = "flex";
	classone[1].style.display = "flex";
	document.getElementsByClassName('fullname')[0].style.display = "inline-block";
	document.getElementsByClassName('formfullname')[0].style.display = "none";
	document.getElementsByClassName('boxfullname')[0].value = "";
	document.getElementsByClassName('email')[0].style.display = "inline-block";
	document.getElementsByClassName('formemail')[0].style.display = "none";
	document.getElementsByClassName('boxemail')[0].value = "";
	document.getElementsByClassName('mobile')[0].style.display = "inline-block";
	document.getElementsByClassName('formmobile')[0].style.display = "none";
	document.getElementsByClassName('boxmobile')[0].value = "";

	setTimeout(() => {
		classone[0].classList.add("active");
		classone[1].classList.add("active");
		document.getElementsByClassName("fullname")[0].classList.add("activetransition");
		document.getElementsByClassName("formfullname")[0].classList.add("activetransition");
		document.getElementsByClassName("username")[0].classList.add("activetransition");
		document.getElementsByClassName("emailout")[0].classList.add("activetransition");
		document.getElementsByClassName("formemail")[0].classList.add("activetransition");
		document.getElementsByClassName("mobileout")[0].classList.add("activetransition");
		document.getElementsByClassName("formmobile")[0].classList.add("activetransition");
		document.getElementsByClassName("verifyout")[0].classList.add("activetransition");
	}, 500);

	var xhttp = new XMLHttpRequest();
	var url = '/profile';
	xhttp.onreadystatechange = () => {
		if (xhttp.readyState == 4) {
			var res = JSON.parse(xhttp.response);
			if(res.success == true) {
				document.getElementsByClassName("profilephoto")[0].style.backgroundImage = 'url("/images/' + res.user.photo + '")';
				document.getElementsByClassName("fullname")[0].innerHTML = res.user.name + '<i class="edit fas fa-pen" onclick = "Edit(\'fullname\')"> </i>';
				document.getElementsByClassName("username")[0].innerHTML = res.user.username;
				document.getElementsByClassName("email")[0].innerHTML = res.user.email + '<i class="edit fas fa-pen" onclick = "Edit(\'email\')"> </i>';
				document.getElementsByClassName("mobile")[0].innerHTML = res.user.mobile + '<i class="edit fas fa-pen" onclick = "Edit(\'mobile\')"> </i>';
				if(res.user.verified == false) {
					document.getElementsByClassName("verify")[0].innerHTML = 'Your Account is Not Verified';
					document.getElementsByClassName("buttonverify")[0].style.display = "inline-block";
				}
				else {
					document.getElementsByClassName("verify")[0].innerHTML = 'Your Account is Verified';
					document.getElementsByClassName("buttonverify")[0].style.display = "none";
				}
			}
			else {
				document.getElementsByClassName("fullname")[0].innerHTML = "ERROR";
			}
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

var Verify = () => {
	var xhttp = new XMLHttpRequest();
	var url = '/profile/verify';
	xhttp.onreadystatechange = () => {
		if (xhttp.readyState == 4) {
			var res = JSON.parse(xhttp.response);
			if(res.success == true)
				document.getElementsByClassName("sent")[0].style.visibility = "visible";
			else {
				document.getElementsByClassName("sent")[0].innerHTML = "Error";
				document.getElementsByClassName("sent")[0].style.visibility = "visible";
			}
			setTimeout(() => {
				document.getElementsByClassName("sent")[0].style.visibility = "hidden";
			}, 4000);
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

var Editor = () => {
	var classone = document.getElementsByClassName("profile");
	var classtwo = document.getElementsByClassName("editor");
	document.getElementsByClassName("profiletab")[0].classList.remove("activetab");
	classone[0].classList.remove("active");
	classone[1].classList.remove("active");
	document.getElementsByClassName("fullname")[0].classList.remove("activetransition");
	document.getElementsByClassName("username")[0].classList.remove("activetransition");
	document.getElementsByClassName("emailout")[0].classList.remove("activetransition");
	document.getElementsByClassName("mobileout")[0].classList.remove("activetransition");
	document.getElementsByClassName("verifyout")[0].classList.remove("activetransition");

	setTimeout(() => {
		classone[0].style.display = "none";
		classone[1].style.display = "none";
		classtwo[0].style.display = "inline-block";
		classtwo[1].style.display = "inline-block";
		classtwo[0].classList.add("active");
		classtwo[1].classList.add("active");
	}, 500);
}

var Edit = (input) => {
	document.getElementsByClassName(input)[0].style.display = "none";
	document.getElementsByClassName('form' + input)[0].style.display = "inline-block";
	document.getElementsByClassName('box' + input)[0].value = "";
	document.getElementsByClassName('box' + input)[0].addEventListener("blur", () => {
		document.getElementsByClassName(input)[0].style.display = "inline-block";
		document.getElementsByClassName('form' + input)[0].style.display = "none";
		document.getElementsByClassName('box' + input)[0].value = "";
	}, true);
}

var Submit = (input) => {
	document.getElementsByClassName('form' + input)[0].addEventListener("keydown", (event) => {
		if (event.keyCode == 27 || event.which == 27) {
			document.getElementsByClassName(input)[0].style.display = "inline-block";
			document.getElementsByClassName('form' + input)[0].style.display = "none";
			document.getElementsByClassName('box' + input)[0].value = "";
		}
	});
	document.getElementsByClassName('form' + input)[0].onkeypress = (event) => {
		if (event.keyCode == 13 || event.which == 13) {
			const form = document.getElementsByClassName('form' + input)[0];
			const data = formToJSON(form.elements);
			var xhttp = new XMLHttpRequest();
			var url = '/users/update';
			xhttp.onreadystatechange = () => {
				if (xhttp.readyState == 4) {
					var res = JSON.parse(xhttp.response);
					if(res.success == true) {
						document.getElementsByClassName(input)[0].innerHTML = res.status + '<i class="edit fas fa-pen" onclick = "Edit(\'' + input + '\')"> </i>';
						document.getElementsByClassName(input)[0].style.display = "inline-block";
						document.getElementsByClassName('form' + input)[0].style.display = "none";
						document.getElementsByClassName('box' + input)[0].value = "";
					}
				}
			};
			xhttp.open("POST", url, true);
			xhttp.setRequestHeader("Content-Type", "application/json");
			xhttp.send(JSON.stringify(data));
		}
	};
}

var Click = () => {
	document.getElementsByClassName('upload')[0].click();
}

var Upload = () => {
	const form = document.getElementsByClassName('formimage')[0];
	var data = document.getElementsByClassName('upload')[0].files[0];
	var formdata = new FormData();
	formdata.append('image', data);
	var xhttp = new XMLHttpRequest();
	var url = '/users/upload';
	xhttp.onreadystatechange = () => {
		if (xhttp.readyState == 4) {
			var res = JSON.parse(xhttp.response);
			if(res.success == 'true') {
				Profile();
			}
		}
	};
	xhttp.open("POST", url, true);
	xhttp.send(formdata);
}

var Text = (done) => {
	GetDoc(0);
	var textline = document.getElementsByClassName('textline')[0];
	var textedit = document.getElementsByClassName('textedit')[0];
	var title = document.getElementsByClassName('title')[0];
	var textoutput = document.getElementsByClassName('textoutput')[0];
	var line = 1;
	var save;

	function scroll_event(e) {
		textline.scrollTop = textedit.scrollTop;
	}

	textedit.addEventListener('scroll', scroll_event, false);

	textedit.addEventListener("keyup", (event) => {
		if(textedit.value == '')
			line = 1;
		else
			line = textedit.value.split('\n').length;
		textline.value = '1\n';
		for (var i = 1; i < line; i++)
			textline.value = textline.value + (i+1) + '\n';
		clearTimeout(save);
		if(done == true) {
			save = setTimeout(() => {
				const form = document.getElementsByClassName('doc')[0];
				const data = formToJSON(form.elements);
				var xhttp = new XMLHttpRequest();
				var url = '/file';
				xhttp.onreadystatechange = () => {
					if (xhttp.readyState == 4) {
						var res = JSON.parse(xhttp.response);
						textoutput.value = res.status;
					}
				};
				xhttp.open("POST", url, true);
				xhttp.setRequestHeader("Content-Type", "application/json");
				xhttp.send(JSON.stringify(data));
			}, 2000);
		}
	});

	textedit.addEventListener("keydown", (event) => {
		var start = textedit.selectionStart;
		var end = textedit.selectionEnd;
		if(event.keyCode == 13) {
			if(textedit.value[start - 1] == '{') {
				event.preventDefault();
				textedit.value = textedit.value.substring(0, start) + '\n\t' + textedit.value.substring(end);
				textedit.selectionStart = textedit.selectionEnd = start + 2;
			}
		}
		if(event.keyCode == 9) {
			event.preventDefault();
			textedit.value = textedit.value.substring(0, start) + '\t' + textedit.value.substring(end);
			textedit.selectionStart = textedit.selectionEnd = start + 1;
		}
		clearTimeout(save);
	});

	title.addEventListener("blur", (event) => {
		if(title.value != '') {
			document.getElementsByClassName('outputlabel')[0].innerHTML = 'Output of ' + title.value;
			done = true;
		}
		else {
			document.getElementsByClassName('outputlabel')[0].innerHTML = 'Please Type in File Name for Output';
			document.getElementsByClassName('textoutput')[0].value = '';
			clearInterval(save);
			done = false;
		}
	});

	window.onclick = (event) => {
		if(event.target == document.getElementsByClassName('open-wrapper')[0]) {
			document.getElementsByClassName('open-content')[0].classList.remove('animate');
			setTimeout(() => {
				document.getElementsByClassName('open')[0].style.display = "none";
			}, 500);
		}
	}
}

var Explore = () => {
	var table = document.getElementsByClassName('open-file')[0];
	document.getElementsByClassName('open')[0].style.display = "table";
	setTimeout(() => {
		document.getElementsByClassName('open-content')[0].classList.add('animate');
	}, 100);

	var xhttp = new XMLHttpRequest();
	var url = '/file';
	xhttp.onreadystatechange = () => {
		if (xhttp.readyState == 4) {
			var res = JSON.parse(xhttp.response);
			if(res.success == true) {
				table.innerHTML = "";
				for (var i = 0; i < res.length; i++)
					table.innerHTML = table.innerHTML + '<tr onclick = "GetDoc(' + i + ')"> <td>' + (i+1) + '</td><td>' + res.status[i].title + '</td><td>' + res.status[i].updatedAt.substring(0, 10) + '</td></tr>';
			}
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

var GetDoc = (index) => {
	var xhttp = new XMLHttpRequest();
	var url = '/file';
	xhttp.onreadystatechange = () => {
		if (xhttp.readyState == 4) {
			var res = JSON.parse(xhttp.response);
			if(res.success == true) {
				Open(res, index);
				document.getElementsByClassName('open-content')[0].classList.remove('animate');
				setTimeout(() => {
					document.getElementsByClassName('open')[0].style.display = "none";
				}, 500);
			}
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

var Open = (res, index) => {
	var textline = document.getElementsByClassName('textline')[0];
	var textedit = document.getElementsByClassName('textedit')[0];
	var title = document.getElementsByClassName('title')[0];
	var textoutput = document.getElementsByClassName('textoutput')[0];
	var line = 1;

	title.value = res.status[index].title;
	textedit.value = res.status[index].text;
	document.getElementsByClassName('outputlabel')[0].innerHTML = 'Output of ' + title.value;

	if(textedit.value == '')
		line = 1;
	else
		line = textedit.value.split('\n').length;
	textline.value = '1\n';
	for (var i = 1; i < line; i++)
		textline.value = textline.value + (i+1) + '\n';
	const form = document.getElementsByClassName('doc')[0];
	const data = formToJSON(form.elements);
	var xhttp = new XMLHttpRequest();
	var url = '/file';
	xhttp.onreadystatechange = () => {
		if (xhttp.readyState == 4) {
			res = JSON.parse(xhttp.response);
			if(res.success == true) {
				textoutput.value = res.status;
				title.focus();
			}
		}
	};
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(data));
}

var SaveBuild = () => {
	if(document.getElementsByClassName('title')[0].value != '') {
		const form = document.getElementsByClassName('doc')[0];
		const data = formToJSON(form.elements);
		var xhttp = new XMLHttpRequest();
		var url = '/file';
		xhttp.onreadystatechange = () => {
			if (xhttp.readyState == 4) {
				var res = JSON.parse(xhttp.response);
				if(res.success == true)
					document.getElementsByClassName('textoutput')[0].value = res.status;
			}
		};
		xhttp.open("POST", url, true);
		xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.send(JSON.stringify(data));
	}
}