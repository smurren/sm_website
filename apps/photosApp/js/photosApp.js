/** 
	Coded by Sean Murren October 2018.
*/


(function(){
	var app = angular.module('photosApp', ["ngRoute"]);		

	//routing is only used in this app to generate browser history
	app.config(function($routeProvider) {
	    $routeProvider
	    .when("/", {
			controller: "PhotosAppController"
	    })
	    .when("/:image", {
		  controller: "PhotosAppController"
	    })
	});


	app.controller('PhotosAppController', function($scope, $http, $window, $location, $routeParams) {
		
		var p = this;

		p.modalOpen = false;
		p.secret = "";
		p.thumbnails = [];  //only what is loaded into view
		p.fullThumbnailsData = [];  //all image filepaths returned from server
		p.thumbnailData = {
			thumbnailAddCount: 10,  //how many to add when hitting bottom of page
			thumbnailCounter: 0,  //used for tracking image loading
			thumbnailsLoaded: 0,
			thumbContainers: []
		};
		p.detailSrc = null;
		p.view = "gallery";
		p.sortIconState = {none: "block", ascend: "none", descend: "none"};
		p.showUploadModal = false;
		p.showEXIFModal = false;
		p.uploading = false;
		p.uploadFiles = null;  //will be a FileList object
		p.filesUploaded = 0;  //upload one image at a time so need to track it (FileList doesn't have pop...)
		p.currentFileUploading = "";
		p.detailZoomed = false;
		p.exifTitle = "";
		p.exifData = [];
		p.exifExclusions = ["undefined", "thumbnail"];
		p.sorterState = "None";
		p.selectedSort = "None";
		p.sortOptions = ["None"];   //Need to request from server

		
		p.clearGallery = function() {
			p.thumbnails = [];  //only what is loaded into view
			p.fullThumbnailsData = [];  //all image filepaths returned from server
			p.thumbnailData = {
				thumbnailAddCount: 10,  //how many to add when hitting bottom of page
				thumbnailCounter: 0,  //used for tracking image loading
				thumbnailsLoaded: 0,
				thumbContainers: []
			};
		};

		p.setView = function(view) {
			if (view) 
				p.view = view;
			if (view === "gallery" && !p.thumbnails.length)
				p.getThumbnails(false);
		};

		p.toggleZoom = function() {
			let img = document.getElementById("fullDetailImage");
			p.detailZoomed = !p.detailZoomed;
			img.style.cursor = p.detailZoomed ? "zoom-out" : "zoom-in";
			img.style.height = p.detailZoomed ? "100%" : null;  //this just overrides the class fullImage class styling for height
		};

		p._hideSortIcons = function() {
			p.sortIconState.none = "none"; 
			p.sortIconState.ascend = "none"; 
			p.sortIconState.descend = "none"; 
		};

		p.toggleSortMenu = function() {

			if (p.selectedSort !== "None") {
				p._hideSortIcons();		
				switch(p.sorterState) {
					case "Descend": p.sortIconState.ascend = "block"; p.sorterState = "Ascend"; break;
					case "Ascend": p.sortIconState.descend = "block"; p.sorterState = "Descend"; break;
					default: p.sortIconState.none = "block"; p.sorterState = "None";  //should not happen
				}
				p.toggleGallerySortDirection();
			}
		};
		//When sorted data is requested it is returned ascending by default.  
		//This is called when user toggles sort direction manually afterwards
		p.toggleGallerySortDirection = function() {

			let originalData;
			//data sent from server was split up as thumbnails get loaded.
			//It is done like this in case sorting doesn't effect ordering (except that it is reveresed)
			while (p.fullThumbnailsData.length)
				p.thumbnails.push(p.fullThumbnailsData.pop());
			
			originalData = p.thumbnails;  //p.thumbnails ref will be set to empty array in clearGallery()

			p.clearGallery();
			p.fullThumbnailsData = originalData;
			p.loadThumbnails();

		};

		//triggered when user changes sort selection.  Need to request new thumbnail data sorted by sort selection
		//server does the sorting using exif data stored in a database
		p.sortSelected = function() {

			p._hideSortIcons();

			if (p.selectedSort !== "None") {
				p.sorterState = "Ascend";
				p.sortIconState.ascend = "block"; 
			}
			else {
				p.sorterState = "None";
				p.sortIconState.none = "block"; 
			}

			p.getThumbnails(false);
		};

		p.setModalState = function(state) { p.modalOpen = state.toLowerCase() === "open" ? true : false; };

		p.openUploadModal = function() { p.showEXIFModal = false; p.showUploadModal = true; p.setModalState('open'); };

		p.openEXIFModal = function() { p.showUploadModal = false; p.showEXIFModal = true;  p.setModalState('open'); };

		p.loadThumbnails = function() {
			let count = 0;
			while (p.fullThumbnailsData.length && count++ < p.thumbnailData.thumbnailAddCount)	
				p.thumbnails.push(p.fullThumbnailsData.pop());
		};

		p.getSortOptions = function() {
			$http({
				url: "/photos/sortoptions",
		    		method: 'GET',
				}).then(response => {
		    			if (response.status === 200) {
						p.sortOptions = p.sortOptions.concat(response.data.sort());
					}
					else {
						console.log("ERROR:  Unable to load sort options");
					}
			});
		};

		p.getThumbnails = function(uploadFlag) {
			//get request for list of relative image file paths
			$http({
				url: "/photos/gallery/"+p.selectedSort,
		    		method: 'GET',
				}).then(response => {
		    			if (response.status === 200) {
						
						if (uploadFlag) {
							let existingThumbs = p.thumbnails.concat(p.fullThumbnailsData).map(t => t[0]);
							p.fullThumbnailsData = response.data.filter(t => existingThumbs.indexOf(t[0]) === -1);	
						}									
						else {
							p.clearGallery();
							p.fullThumbnailsData = response.data;
						}

						p.loadThumbnails();
					}
					else {
						alert("There was an error loading the gallery");
					}
			});
		};

		p.viewImage = function(img) {
			p.detailSrc = img;
			$location.path("/"+img.replace("photos/", ""));
		};

		p._upload = function(file) {

			let formData = new FormData();				
			formData.append('secret', p.secret);
   			formData.append('files', file);

			p.currentFileUploading = file.name;

			//make REST call with secret and files data
			$http({
				url: "/photos/upload",
		    		method: 'POST',
		   	 	data: formData,
				headers: {'Content-Type': undefined},
				}).then(response => {
		    			if (response.status === 200 && response.data.success) {

						if (++p.filesUploaded < p.uploadFiles.length) {
							p._upload(p.uploadFiles[p.filesUploaded]);
						}
						else {
							p.uploading = false;
							p.setModalState("closed");
							modal.style.cursor = null;
							p.view = "gallery"
							p.getThumbnails(true);
						}
					}
					else {
						if (response.data.success)
							alert("There was an error uploading your images");
						else
							alert("Upload failed.  \nReason:  " + response.data.reason);
					}
					
			});
		};
		
		p.upload = function() {

			const files = document.querySelector('[type=file]').files;
			const modal = document.getElementById("modal");
			let valid = true;
			//first validate input
			if (p.secret === "") {
				document.getElementById("secretInput").style.border = "solid 1px red";
				valid = false;
			}
			if (!files.length) {
				document.getElementById("fileInput").style.border = "solid 1px red";
				valid = false;
			}
			if (!valid)
				return;

			p.uploading = true;
			p.uploadFiles = files;
			modal.style.cursor = "wait";

			p._upload(p.uploadFiles[p.filesUploaded]);
		};

		p.infScroll = function() {

			if (p.fullThumbnailsData.length) {
				let windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
				let windowBottom = windowHeight + window.pageYOffset;
				let imgs = document.querySelectorAll("img");
				let lastImage = imgs[imgs.length-1];
				let loadPoint = lastImage.offsetTop + lastImage.clientHeight * 0.33;

				if (windowBottom >= loadPoint) {
					//append more images
					p.loadThumbnails();
					$scope.$apply();
				}
			}
		};		
		angular.element($window).bind("scroll", p.infScroll);		

		$scope.$on('$routeChangeStart', function($event, next, current) {
			if (next.$$route.originalPath === "/")  {
				p._hideSortIcons();		
				switch(p.sorterState) {
					case "Descend": p.sortIconState.descend = "block"; break;
					case "Ascend": p.sortIconState.ascend = "block"; break;
					default: p.sortIconState.none = "block"; 
				}
				p.setView("gallery");
			}
			else if (next.$$route.originalPath === "/:image")
				p.setView("detail");
		});
		//this is necessary because ng-view is not being used and routeparams may be empty initially
		$scope.$on('$routeChangeSuccess', function() {
			if (p.view === "detail") {
				p.detailSrc = "photos/"+$routeParams.image;
			}
		});

		thumbLoaded = function() {
			let containers = p.thumbnailData.thumbContainers;
			let gallery = document.getElementById("gallery");
			let thumbContainer = gallery.children[p.thumbnailData.thumbnailsLoaded + p.thumbnailData.thumbnailCounter];
			
			p.thumbnailData.thumbnailCounter++;
			containers.push(thumbContainer);

			if (p.thumbnailData.thumbnailsLoaded + p.thumbnailData.thumbnailCounter === p.thumbnails.length || p.thumbnailData.thumbnailCounter === p.thumbnailData.thumbnailAddCount) {
				//if there are more images and the screen is not filled enough for scrolling, load more
				let html = document.querySelector("html");
				if (p.thumbnails.length < p.fullThumbnailsData.length && html.clientHeight === html.scrollHeight) {		
					//append more images
					p.loadThumbnails();		
					$scope.$apply();
				}
				p.infScroll();
			}
			
		};
				
		p.getExif = function(img) {
			EXIF.getData(img, function() {
				let exif = EXIF.getAllTags(this);
				p.exifTitle = exif["Make"] + " - " + exif["Model"];
				p.exifData = Object.entries(exif).filter(
									entry => p.exifExclusions.indexOf(entry[0]) == -1
								).sort(function(a,b){ 
									return a[0].toLowerCase() > b[0].toLowerCase() ; 
								});
			});
			
		};

		getDetailExif = function() {
			p.getExif(document.querySelector("img"));  //only one in detail view
			document.getElementById("exifButton").disabled = false;
		};
		
		p.modalDisplay = "flex";
		p.getSortOptions();

	});
	

	
})();