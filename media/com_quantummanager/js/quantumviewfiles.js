/**
 * @package    quantummanager
 *
 * @author     Cymbal <cymbal@delo-design.ru>
 * @copyright  Copyright (C) 2019 "Delo Design". All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 * @link       https://delo-design.ru
 */

window.Quantumviewfiles = function(Filemanager, ViewfilesElement, options) {

    this.element = ViewfilesElement;
    this.options = options;
    this.path = '';
    this.file = '';
    this.directory = '';
    this.lastTypeViewFiles = '';
    this.bufferTopDirectories = {};
    this.listFiles = '';
    this.history = [];
    this.breadcrumbsLists = [];
    this.breadcrumbsWaitLoad = false;

    this.init = function() {
        let self = this;
        this.path = this.options.directory;
        this.initBreadcrumbs();
        this.loadDirectory();

        if(!parseInt(self.options.onlyfiles)) {

            Filemanager.Quantumtoolbar.buttonAdd('viewfilesBack', 'left', 'btn-back', QuantumviewfilesLang.buttonBack, 'quantummanager-icon-back', {}, function (ev) {

                let directory;

                if(self.history.length > 0) {
                    directory = self.history[self.history.length - 1];
                    self.history.splice(self.history.length - 2, 2);
                    self.loadDirectory(directory);
                }

                Filemanager.data.path = directory;
                Filemanager.Quantumtoolbar.trigger('buttonViewfilesBack');
                ev.preventDefault();
            });

            Filemanager.Quantumtoolbar.buttonAdd('viewfilesUp', 'left', 'btn-up', QuantumviewfilesLang.buttonUp, 'quantummanager-icon-up', {}, function (ev) {
                let currDirectories = Filemanager.data.path.split('/');
                if (currDirectories.length > 1) {
                    currDirectories.pop();
                    Filemanager.data.path = currDirectories.join('/');
                    self.trigger('updatePath');
                }
                Filemanager.Quantumtoolbar.trigger('buttonViewfilesUp');
                ev.preventDefault();
            });

            Filemanager.Quantumtoolbar.buttonAdd('viewfilesReloadPaths', 'left', 'btn-reload', '', 'quantummanager-icon-reload', {}, function (ev) {
                Filemanager.events.trigger('reloadPaths', Filemanager);
                Filemanager.Quantumtoolbar.trigger('buttonViewfilesReloadPaths');
                ev.preventDefault();
            });

            Filemanager.Quantumtoolbar.buttonAdd('viewfilesCreateDirectory', 'left', 'btn-create-directory hidden-label', QuantumviewfilesLang.buttonCreateDirectory, 'quantummanager-icon-directory', {}, function (ev) {
                let nameDirectory;
                nameDirectory = prompt(QuantumviewfilesLang.directoryName, '');

                if(nameDirectory !== null) {
                    jQuery.get("/administrator/index.php?option=com_quantummanager&task=quantumviewfiles.createDirectory&path=" + encodeURIComponent(Filemanager.data.path) + '&name=' + encodeURIComponent(nameDirectory)).done(function (response) {
                        Filemanager.events.trigger('reloadPaths', Filemanager);
                    });
                } else {
                    alert('Введите имя папки')
                }

                Filemanager.Quantumtoolbar.trigger('buttonViewfilesCreateDirectory');
                ev.preventDefault();
            });

            Filemanager.Quantumtoolbar.buttonAdd('viewfilesDelete', 'left', 'btn-delete btn-hide hidden-label', QuantumviewfilesLang.buttonDelete, 'quantummanager-icon-delete', {}, function (ev) {

                let filesAll = ViewfilesElement.querySelectorAll('.field-list-files .file-item');
                let files = [];

                for(let i=0;i<filesAll.length;i++) {
                    if (filesAll[i].querySelector('input').checked) {
                        files.push(filesAll[i].querySelector('.file-name').innerHTML);
                    }
                }

                jQuery.get("/administrator/index.php?option=com_quantummanager&task=quantumviewfiles.delete&path=" + encodeURIComponent(Filemanager.data.path) + '&list=' + encodeURIComponent(JSON.stringify(files))).done(function (response) {
                    Filemanager.events.trigger('reloadPaths', Filemanager);
                });

                Filemanager.Quantumtoolbar.trigger('buttonViewfilesDelete');
                ev.preventDefault();
            });

            Filemanager.Quantumtoolbar.buttonAdd('viewfilesGrid', 'right', 'btn-grid quantummanager-tooltip hidden-label', QuantumviewfilesLang.buttonGrid, 'quantummanager-icon-grid', {'data-tooltip': QuantumviewfilesLang.changeGridViews}, function (ev) {
                Filemanager.Quantumviewfiles.ListviewToGrid();
                Filemanager.Quantumtoolbar.trigger('buttonViewfilesGrid');
                ev.preventDefault();
            });

            Filemanager.Quantumtoolbar.buttonAdd('viewfilesTable', 'right', 'btn-table hidden-label', QuantumviewfilesLang.buttonTable, 'quantummanager-icon-table', {}, function (ev) {
                Filemanager.Quantumviewfiles.ListviewToTable();
                Filemanager.Quantumtoolbar.trigger('buttonViewfilesTable');
                ev.preventDefault();
            });

        }
    };

    this.loadDirectory = function (path, callback) {

        let self = this;

        if(path === null || path === undefined) {
            path = this.path;
        } else {
            this.path = path;
        }


        if (Filemanager.data.path === undefined || Filemanager.data.path !== path) {
            Filemanager.data.path = path;
        }

        ViewfilesElement.querySelector('.view').innerHTML = '';
        this.preoloader();

        jQuery.get("/administrator/index.php?option=com_quantummanager&task=quantumviewfiles.getFiles&path=" + encodeURIComponent(path)).done(function (response) {
            response = JSON.parse(response);
            let htmlfilesAndDirectories = '<div class="field-list-files"><div class="list">';
            let files = response.files;
            let directories = response.directories;

            if(!parseInt(self.options.onlyfiles)) {
                for (let i = 0; i < directories.length; i++) {
                    htmlfilesAndDirectories += "<div class='directory-item'><div class='directory'><div class='directory-icon'><span></span></div><div class='directory-name'>" + directories[i] + "</div></div></div>";
                }
            }

            for(let i = 0;i<files.length;i++) {
                let type = files[i].split('.');
                htmlfilesAndDirectories += "<div class='file-item'><input type=\"checkbox\" class=\"import-files-check-file\"><div class='file'><div class='file-exs icon-file-" + type.pop() + "'><div class='av-folderlist-label'></div></div><div class='file-name'>" + files[i] + "</div></div></div>" ;
            }

            htmlfilesAndDirectories += "</div></div>";

            if(files.length === 0 && directories.length === 0) {
                htmlfilesAndDirectories = "<div class='empty'><div>" + QuantumviewfilesLang.empty + "</div></div>";
            }

            ViewfilesElement.querySelector('.view').innerHTML = '';
            ViewfilesElement.querySelector('.view').innerHTML = htmlfilesAndDirectories;
            self.reloadTypeViewFiles(path);
            self.listFiles = ViewfilesElement.querySelector('.field-list-files');

            if(self.bufferTopDirectories[path] !== undefined) {
                if(self.listFiles !== null && self.listFiles.scrollTop !== undefined) {
                    self.listFiles.scrollTop = self.bufferTopDirectories[path];
                }
            }

            let filesAll = ViewfilesElement.querySelectorAll('.field-list-files .file-item');
            let directoriesAll = ViewfilesElement.querySelectorAll('.field-list-files .directory-item');
            let timer = 0;
            let delay = 200;
            let prevent = false;

            for(let i=0;i<filesAll.length;i++) {
                filesAll[i].addEventListener('click', function () {
                    let element = this;
                    timer = setTimeout(function() {
                        if (!prevent) {
                            self.fileClick(element, self);
                        }
                        prevent = false;
                    }, delay);
                });

                filesAll[i].addEventListener('dblclick', function () {
                    let element = this;
                    clearTimeout(timer);
                    prevent = true;
                    self.fileDblclick(element, self);
                });
            }

            if(!parseInt(self.options.onlyfiles)) {
                for(let i=0;i<directoriesAll.length;i++) {
                    directoriesAll[i].addEventListener('click', function () {
                        let directory = this.querySelector('.directory-name').innerHTML;
                        Filemanager.data.path = self.path + '/' + directory;

                        if(localStorage !== undefined) {
                            localStorage.setItem('quantummanagerLastDir', Filemanager.data.path);
                        }

                        self.directory = this;
                        self.trigger('updatePath');
                        self.trigger('clickDirectory');
                    });
                }
            }

            self.buildBreadcrumbs();

            if(callback !== undefined) {
                callback();
            }

        });

    };

    this.fileClick = function (element, qvf) {
        let tmpInput = element.closest('.file-item').querySelector('.import-files-check-file');
        tmpInput.checked = !tmpInput.checked;
        qvf.file = element;
        qvf.trigger('clickFile', element);
    };

    this.fileDblclick = function (element, qvf) {
        qvf.trigger('dblclickFile', element);
    };

    this.preoloader = function () {
        ViewfilesElement.querySelector('.view').innerHTML = "<div class=\"loader\">" +  QuantumviewfilesLang.loading + "<span></span><span></span><span></span><span></span></div>";
    };

    this.initBreadcrumbs = function (callback) {
        let self = this;
        let fm = Filemanager;
        jQuery.get("/administrator/index.php?option=com_quantummanager&task=quantumtreecatalogs.getDirectories&path=" + encodeURIComponent(this.options.directory))
            .done(function (response) {
                response = JSON.parse(response);

                self.breadcrumbsLists = response.directories;

                if(callback !== undefined) {
                    callback(self, fm)
                }

                self.trigger('afterInitBreadcrumbs', self);
        }).fail(function () {
            self.breadcrumbsWaitLoad = false;
        });
    };

    this.buildBreadcrumbs = function (el, fm) {

        let self = this;

        if(el !== undefined) {
            self = el;
        }

        if(fm === undefined) {
            fm = Filemanager;
        }

        if(self.breadcrumbsLists === undefined || self.breadcrumbsLists.length === 0) {
            self.initBreadcrumbs(self.buildBreadcrumbs);
            return;
        }

        let currPaths = self.path.split('/');
        let htmlBreadcrumbs = ViewfilesElement.querySelector('.breadcumbs');
        let html = "<ul class='breadcumbs-ul'>";
        let lastElement;
        let clPaths = [];
        let pathAtr = '';

        for(let i=0;i<currPaths.length;i++) {
            if(i === 0) {
                pathAtr = currPaths[i];
                html += "<li class='clPath root' data-path='" + pathAtr + "'><span>" + currPaths[i] + "</span></li>";
                lastElement = self.breadcrumbsLists.subpath;

                if(self.breadcrumbsLists.subpath.length > 0) {
                    html += '<li class="carret dropdown"><span></span><div class="dropdown-content"><ul>';
                    for (let j=0;j<self.breadcrumbsLists.subpath.length;j++) {
                        html += "<li><span class='clPath' data-path='" + pathAtr + "/" + self.breadcrumbsLists.subpath[j].path + "'>" + self.breadcrumbsLists.subpath[j].path + "</span></li>";
                    }
                    html += '</ul></div></li>';
                }

            } else {
                let otherPaths = [];
                let findPath = '';
                let findElement = lastElement;
                for (let j=0;j<lastElement.length;j++) {
                    if(lastElement[j].path === currPaths[i]) {
                        findPath += currPaths[i];
                        findElement = lastElement[j].subpath
                    } else {
                        otherPaths.push(lastElement[j].path);
                    }
                }

                lastElement = findElement;

                if(otherPaths.length > 0) {
                    html += '<li class="dropdown"><span class="clPath" data-path="' + pathAtr + '/' + findPath + '">' + findPath + '</span><div class="dropdown-content"><ul>';
                } else {
                    html += '<li><span class="clPath" data-path="' + pathAtr  + '/' + findPath + '">' + findPath + '</span>';
                }

                for (let j=0;j<otherPaths.length;j++) {
                    html += "<li><span class='clPath' data-path='" + pathAtr + "/" + otherPaths[j] + "'>" + otherPaths[j] + "</span></li>";
                }

                if(otherPaths.length > 0) {
                    html += "</ul></div></li>";
                } else {
                    html += "</li>";
                }


                if(lastElement.length > 0) {
                    html += '<li class="carret dropdown"><span></span><div class="dropdown-content"><ul>';
                    for (let j=0;j<lastElement.length;j++) {
                        html += "<li><span class='clPath' data-path='" + pathAtr + "/" + findPath + '/' + lastElement[j].path + "'>" + lastElement[j].path + "</span></li>";
                    }
                    html += '</ul></div></li>';
                }

                pathAtr += '/' + findPath;

            }
        }

        html += "</ul>";
        htmlBreadcrumbs.innerHTML = html;
        clPaths = htmlBreadcrumbs.querySelectorAll('.clPath');

        for(let i=0;i<clPaths.length;i++) {
            clPaths[i].addEventListener('click', function (ev) {
                fm.data.path = this.getAttribute('data-path');

                if(localStorage !== undefined) {
                    localStorage.setItem('quantummanagerLastDir', fm.data.path);
                }

                self.trigger('updatePath');
                ev.preventDefault();
            });
        }


    };

    this.scrollTopFilesCheck = function (files) {
        let filesAll = ViewfilesElement.querySelectorAll('.field-list-files .file-item');
        let self = this;
        let find = false;
        for(let i=0;i<filesAll.length;i++) {
            let input = filesAll[i].querySelector('.import-files-check-file');
            let nameFile = filesAll[i].querySelector('.file-name').innerHTML;

            if(typeof files === 'string') {
                if(files === nameFile) {
                    if(!input.checked) {
                        input.checked = !input.checked;
                    }
                    setTimeout(function () {
                        self.listFiles.scrollTop = filesAll[i].getBoundingClientRect().top - 460;
                    }, 300)
                } else {
                    input.checked = false;
                }
            }

            if(typeof files === 'object') {

                if(files.indexOf(nameFile) !== -1) {
                    if(!input.checked) {
                        input.checked = !input.checked;
                    }

                    if(!find) {
                        find = true;
                        setTimeout(function () {
                            self.listFiles.scrollTop = filesAll[i].getBoundingClientRect().top - 460;
                        }, 300);
                    }

                } else {
                    input.checked = false;
                }

            }


        }
    };

    this.ListviewToGrid = function () {
        this.lastTypeViewFiles = 'list-grid';
        this.reloadTypeViewFiles();
    };

    this.ListviewToTable = function () {
        this.lastTypeViewFiles = 'list-table';
        this.reloadTypeViewFiles();
    };

    this.reloadTypeViewFiles = function(path) {
        let filesAll = ViewfilesElement.querySelectorAll('.field-list-files .file-item');
        let viewFiles = ViewfilesElement.querySelector('.field-list-files .list');

        if(this.lastTypeViewFiles === '') {
            this.lastTypeViewFiles = 'list-grid';
            let currLastTypeViewFiles = localStorage.getItem('quantummanagerLastTypeViewFiles');
            if(currLastTypeViewFiles !== null) {
                this.lastTypeViewFiles = currLastTypeViewFiles;
            }
        }

        if(path === undefined || path === null) {
            path = this.path;
        }

        if(viewFiles === null || viewFiles === undefined) {
            return;
        }

        if(this.lastTypeViewFiles === 'list-grid') {
            let gridColumn = 'list-grid-1-5';
            let gridColumnCache = '';
            if(localStorage !== undefined) {
                gridColumnCache = localStorage.getItem('quantummanagerLastTypeViewFilesGrid');
            }

            if (gridColumnCache !== null) {
                gridColumn = gridColumnCache;
            }

            if(viewFiles.classList.contains('list-grid-1-5')) {
                gridColumn = 'list-grid-1-4';
            }

            if(viewFiles.classList.contains('list-grid-1-4')) {
                gridColumn = 'list-grid-1-3';
            }

            if(viewFiles.classList.contains('list-grid-1-3')) {
                gridColumn = 'list-grid-1-5';
            }

            if(localStorage !== undefined) {
                localStorage.setItem('quantummanagerLastTypeViewFilesGrid', gridColumn);
            }

            viewFiles.setAttribute('class', 'list list-grid ' + gridColumn);

        }


        if(this.lastTypeViewFiles === 'list-table') {
            viewFiles.setAttribute('class', 'list list-table');
        }

        if(localStorage !== undefined) {
            localStorage.setItem('quantummanagerLastTypeViewFiles', this.lastTypeViewFiles);
        }

        for(let i=0;i<filesAll.length;i++) {

            if(this.path !== path) {
                break;
            }

            if(this.lastTypeViewFiles === 'list-grid') {
                let fileName = filesAll[i].querySelector('.file-name').innerHTML;
                let fileExs = filesAll[i].querySelector('.file-exs');
                let exs = fileName.split('.').pop();
                let exsImage = ['jpg', 'png', 'svg', 'jpeg', 'gif'];
                if(exsImage.indexOf(exs.toLowerCase()) !== -1) {
                    let file = "/images/com_quantummanager/cache/" + path.replace('root', path) + '/' + fileName + '?' + QuantumUtils.randomInteger(111111, 999999);

                    if(exs.toLowerCase() === 'svg') {
                        file = "/" + path.replace('root', path) + '/' + fileName + '?' + QuantumUtils.randomInteger(111111, 999999);
                    }

                    if(exs.toLowerCase() === 'gif') {
                        file = "/images/com_quantummanager/cache/" + path.replace('root', path) + '/' + fileName;
                    }

                    fileExs.style.backgroundImage = "url(" + file + ")";
                } else {
                    let exsAvailable = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'mp3', 'ogg', 'flac', 'pdf', 'zip', 'txt', 'html', 'css', 'js', 'webp'];
                    if(exsAvailable.indexOf(exs) !== -1) {
                        let file = "/media/com_quantummanager/images/icons/" + exs + ".svg";
                        fileExs.style.backgroundImage = "url(" + file + ")";
                        fileExs.classList.add('file-icons');
                    } else {
                        let file = "/media/com_quantummanager/images/icons/other.svg";
                        fileExs.style.backgroundImage = "url(" + file + ")";
                        fileExs.classList.add('file-icons');
                    }
                }

            }

            if(this.lastTypeViewFiles === 'list-table') {
                let fileExs = filesAll[i].querySelector('.file-exs');
                fileExs.style.backgroundImage = "";
            }

        }
    };

    this.trigger = function(event, target) {
        Filemanager.events.trigger(event, Filemanager, target);
    };

    Filemanager.events.add(this, 'clickFile', function (fm, el) {
        let filesAll = el.element.querySelectorAll('.field-list-files .file-item');
        let find = false;

        for(let i=0;i<filesAll.length;i++) {
            if (filesAll[i].querySelector('input').checked) {
                find = true;
            }
        }

        if(find) {
            if(fm.Quantumtoolbar !== undefined) {
                fm.Quantumtoolbar.buttonsList['viewfilesDelete'].classList.remove('btn-hide');
            }
        } else {
            if(fm.Quantumtoolbar !== undefined) {
                fm.Quantumtoolbar.buttonsList['viewfilesDelete'].classList.add('btn-hide');
            }
        }
    });

    Filemanager.events.add(this, 'updatePath', function (fm, el) {
        //вырубаем кнопки для выделенного
        if(fm.Quantumtoolbar !== undefined) {
            fm.Quantumtoolbar.buttonsList['viewfilesDelete'].classList.add('btn-hide');
        }

        //запоминаем позицию прокрутки в директории
        if(el.listFiles !== '' && el.listFiles !== null) {
            el.bufferTopDirectories[el.path] = el.listFiles.scrollTop;
        }

        //добавление в историю
        el.history.push(el.path);

        //переключаем путь и открываем папку
        el.path = fm.data.path;
        el.loadDirectory(el.path);

    });

    Filemanager.events.add(this, 'afterInitBreadcrumbs', function (fm, el) {
        if(localStorage !== undefined) {
            let openLastDir = localStorage.getItem('quantummanagerLastDir');
            let findPath = function (pathSearch, pathParent, find, level) {
                if(level === 0) {
                    if(find === pathSearch.path) {
                        Filemanager.data.path = find;
                        el.path = find;
                        el.trigger('updatePath');
                        return;
                    } else {
                        findPath(pathSearch.subpath, pathSearch.path, find, level + 1);
                        return;
                    }
                }

                for (let i=0;i<pathSearch.length;i++) {
                    if(find === (pathParent + '/' + pathSearch[i].path)) {
                        Filemanager.data.path = find;
                        el.path = find;
                        el.trigger('updatePath');
                        return;
                    } else {
                        findPath(pathSearch[i].subpath, pathParent + '/' + pathSearch[i].path, find, level + 1);
                    }
                }

            };

            findPath(el.breadcrumbsLists, '', openLastDir, 0);

        }
    });

    Filemanager.events.add(this, 'reloadPaths', function (fm, el) {
        fm.Quantumviewfiles.initBreadcrumbs(fm.Quantumviewfiles.buildBreadcrumbs);
        fm.Quantumviewfiles.loadDirectory(fm.data.path);
    });

    Filemanager.events.add(this, 'uploadComplete', function (fm, el) {
        Filemanager.Quantumviewfiles.loadDirectory(null, function () {
            fm.Quantumviewfiles.scrollTopFilesCheck(Filemanager.Qantumupload.filesLists);

            let filesAll = el.element.querySelectorAll('.field-list-files .file-item');
            let find = false;

            for(let i=0;i<filesAll.length;i++) {
                if (filesAll[i].querySelector('input').checked) {
                    find = true;
                }
            }

            if(find) {
                fm.Quantumtoolbar.buttonsList['viewfilesDelete'].classList.remove('btn-hide');
            } else {
                fm.Quantumtoolbar.buttonsList['viewfilesDelete'].classList.add('btn-hide');
            }

            //fm.Quantumviewfiles.initBreadcrumbs(fm.Quantumviewfiles.buildBreadcrumbs);

        });
    });

};