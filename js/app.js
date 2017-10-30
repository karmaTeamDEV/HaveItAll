var serviceurl = 'http://localhost/haveitall/api/index.php/';
var regular_url = 'http://localhost/haveitall/#!/';
// var regular_url = 'http://216.250.115.23/haveitall/#!/'; 
// var serviceurl = 'http://216.250.115.23/haveitall/api/index.php/';
var app = angular.module('app', ['angucomplete','ngAnimate','ngMaterial','hm.readmore','ui.select2','ui.tinymce','ngResource','ui.router','ngStorage','duScroll','autocomplete', 'ui.bootstrap' ]).value('duScrollDuration', 2000);
//'angularjs-dropdown-multiselect',
//'btorfs.multiselect'
//'aurbano.multiselect',
//'isteven-multi-select'
//,'btorfs.multiselect'
//'ngTextTruncate'
//'720kb.datepicker'
app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
    .state('user', {
      url: '/user',
              //cache: false,
              abstract: true,
              templateUrl: 'include/topUser.html',
              controller: 'UserCtrl'
          })
    .state('control', {
      url: '/control',
              //cache: false,
              abstract: true,
              templateUrl: 'include/admin_top.html',
              controller: 'AdminCtrl'
          })
    .state('control.admin', {
            cache: false,
            url: '/admin',
            views: {
                'menuContentadmin': {
                    templateUrl: 'templates/admin.html',
                    controller: 'AdminController'
                }
            }
    })
     .state('control.manageuser', {
            cache: false,
            url: '/manageuser',
            views: {
                'menuContentadmin': {
                    templateUrl: 'templates/manageusersCMS.html',
                    controller: 'ManageUserCMSController'
                }
            }
    })
     .state('control.managecms', {
            cache: false,
            url: '/managecms',
            views: {
                'menuContentadmin': {
                    templateUrl: 'templates/managetypecategoriesCMS.html',
                    controller: 'ManagetypesCMSController'
                }
            }
    })
     .state('control.manageindustry', {
            cache: false,
            url: '/manageindustry',
            views: {
                'menuContentadmin': {
                    templateUrl: 'templates/manageindustryCMS.html',
                    controller: 'ManageindustryCMSController'
                }
            }
    }) 
    .state('control.managecompany', {
            cache: false,
            url: '/managecompany',
            views: {
                'menuContentadmin': {
                    templateUrl: 'templates/managecompanyCMS.html',
                    controller: 'ManagecompanyCMSController'
                }
            }
    })
    .state('home', {
        cache: false,
        url: '/',
        templateUrl: 'templates/home.html',
        controller: 'HomeController'
    })
    .state('login', {
        cache: false,
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
    })
    .state('register', {
        cache: false,
        url: '/register',
        templateUrl: 'templates/register.html',
        controller: 'RegisterController'
    }).state('employer-register', {
        cache: false,
        url: '/employer-register',
        templateUrl: 'templates/employer_register.html',
        controller: 'EmployersController'
    }).state('forgot-psw', {
        cache: false,
        url: '/forgot-psw',
        templateUrl: 'templates/forgot_psw.html',
        controller: 'ForgotpswController'
    }).state('privacy', {
        cache: false,
        url: '/privacy',
        templateUrl: 'templates/privacy.html'
            //controller: 'PrivacyController'
    }).state('404', {
        cache: false,
        url: '/404',
        templateUrl: 'templates/404.html'
            //controller: 'PrivacyController'
    })
    .state('resetpsw', {
        cache: false,
        url: '/resetpsw/:param1',
        templateUrl: 'templates/resetpsw.html',
        controller: 'resetPswController'
    })     
    .state('term-and-conditions', {
        cache: false,
        url: '/term-and-conditions',
        templateUrl: 'templates/term.html'
            //controller: 'PrivacyController'
        })        
        .state('user.appHome', {
            cache: false,
            url: '/appHome',
            views: {
                'menuContent': {
                    templateUrl: 'templates/appHome.html',
                    controller: 'AppHomeController'
                }
            }
        }) 
         .state('user.construction', {
            cache: false,
            url: '/construction',
            views: {
                'menuContent': {
                    templateUrl: 'templates/construction.html',
                    //controller: 'AppHomeController'
                }
            }
        }) 
        .state('user.companyHome', {
            cache: false,
            url: '/companyHome',
            views: {
                'menuContent': {
                    templateUrl: 'templates/companyHome.html',
                    controller: 'CompanyHomeController'
                }
            }
        })
        .state('user.profile', {
            cache: false,
            url: '/profile/:user_id/:usertype',
            views: {
                'menuContent': {
                    templateUrl: 'templates/profile.html',
                    //templateUrl: 'templates/test.html',
                    controller: 'ProfileController'
                }
            }
        })

        .state('user.editprofile', {
            cache: false,
            url: '/editprofile',
            views: {
                'menuContent': {
                    templateUrl: 'templates/edit_profile.html',
                    controller: 'EditProfileController'
                }
            }
        }).state('user.job-fit', {
            cache: false,
            url: '/job-fit',
            views: {
                'menuContent': {
                    templateUrl: 'templates/job_fit.html',
                    controller: 'JobFitController'
                }
            }
        }).state('user.employer-fit', {
            cache: false,
            url: '/employer-fit',
            views: {
                'menuContent': {
                    templateUrl: 'templates/employer_fit.html',
                    controller: 'EmployerFitController'
                }
            }
        }).state('linkedinlogin', {
            cache: false,
            url: '/login/:param1',
            templateUrl: 'templates/login.html',
            controller: 'LoginController'
        }).state('user.title-held', {
            cache: false,
            url: '/title-held',
            views: {
                'menuContent': {
                    templateUrl: 'templates/title_held.html',
                    controller: 'TitleHeleController'
                }
            }
        }).state('user.worked-for', {
            cache: false,
            url: '/worked-for',
            views: {
                'menuContent': {
                    templateUrl: 'templates/worked_for.html',
                    controller: 'WorkedForController'
                }
            }
        })
        .state('user.addusers', {
            cache: false,
            url: '/addusers',
            views: {
                'menuContent': {
                    templateUrl: 'templates/add_users.html',
                    controller: 'AddUsersController'
                }
            }
        })
        .state('user.education', {
            cache: false,
            url: '/education',
            views: {
                'menuContent': {
                    templateUrl: 'templates/education.html',
                    controller: 'EducationController'
                }
            }
        })
        .state('user.postJob', {
            cache: false,
            url: '/postJob',
            views: {
                'menuContent': {
                    templateUrl: 'templates/postJob.html',
                    controller: 'PostJobController'
                }
            }
        })
        .state('user.jobFit', {
            cache: false,
            url: '/jobFit',
            views: {
                'menuContent': {
                    templateUrl: 'templates/jobFit.html',
                    controller: 'JobFitController'
                }
            }
        })
        .state('user.cultureFit', {
            cache: false,
            url: '/cultureFit',
            views: {
                'menuContent': {
                    templateUrl: 'templates/cultureFit.html',
                    controller: 'cultureFitController'
                }
            }
        })
         .state('user.typeFit', {
            cache: false,
            url: '/typeFit',
            views: {
                'menuContent': {
                    templateUrl: 'templates/typeFit.html',
                    controller: 'typeFitController'
                }
            }
        })
        .state('user.category', {
            cache: false,
            url: '/category',
            views: {
                'menuContent': {
                    templateUrl: 'templates/category.html',
                    controller: 'categoryController'
                }
            }
        })  
         .state('user.industry', {
            cache: false,
            url: '/industry',
            views: {
                'menuContent': {
                    templateUrl: 'templates/industry.html',
                    controller: 'industryController'
                }
            }
        })
         .state('user.educate', {
            cache: false,
            url: '/educate',
            views: {
                'menuContent': {
                    templateUrl: 'templates/educate.html',
                    controller: 'educateController'
                }
            }
        })
		.state('user.followingcompany', {
            cache: false,
            url: '/followingcompany',
            views: {
                'menuContent': {
                    templateUrl: 'templates/followingcompany.html',
                    //templateUrl: 'templates/test.html',
                    controller: 'FollowingcompanyController'
                }
            }
        })
        .state('user.followuser', {
            cache: false,
            url: '/followuser',
            views: {
                'menuContent': {
                    templateUrl: 'templates/follow_user.html',
                    //templateUrl: 'templates/test.html',
                    controller: 'FollowuserController'
                }
            }
        })
		.state('user.applieduser', {
            cache: false,
            url: '/applieduser',
            views: {
                'menuContent': {
                    templateUrl: 'templates/applieduser.html',                     
                    controller: 'applieduserController'
                }
            }
        })
         .state('user.vieweduser', {
            cache: false,
            url: '/vieweduser',
            views: {
                'menuContent': {
                    templateUrl: 'templates/vieweduser.html',                     
                    controller: 'viewuserController'
                }
            }
        })
         .state('user.test', {
            cache: false,
            url: '/test',
            views: {
                'menuContent': {
                    templateUrl: 'templates/test.html',
                    controller: 'testController'
                }
            }
        })
		
         .state('user.gallery', {
            cache: false,
            url: '/gallery',
            views: {
                'menuContent': {
                    templateUrl: 'templates/gallery.html',
                    controller: 'galleryController'
                }
            }
        })
          .state('user.changepassword', {
            cache: false,
            url: '/cng-psw',
            views: {
                'menuContent': {
                    templateUrl: 'templates/changepsw.html',
                    controller: 'changepswController'
                }
            }
        }).state('user.jobmatch', {
            cache: false,
            url: '/user-job',
            views: {
                'menuContent': {
                    templateUrl: 'templates/user_job_match.html',
                    controller: 'userJobMatchController'
                }
            }
        })
        .state('user.postjobView', {
            cache: false,
            url: '/postjobview/:job_id',
            views: {
                'menuContent': {
                    templateUrl: 'templates/postjobView.html',
                    controller: 'postjobViewController'
                }
            }
        })
        .state('user.location', {
            cache: false,
            url: '/location',
            views: {
                'menuContent': {
                    templateUrl: 'templates/location.html',
                    controller: 'locationController'
                }
            }
        })
         .state('user.jobDetails', {
            cache: false,
            url: '/jobDetails/:job_id',
            views: {
                'menuContent': {
                    templateUrl: 'templates/job_details_view.html',
                    controller: 'jobDetailsController'
                }
            }
        })
         .state('user.message', {
            cache: false,
            url: '/message',
           views: {
                'menuContent': {
                    templateUrl: 'templates/messageView.html',
                    controller: 'messageController'
                }
            }
        })
        .state('user.companyMessage', {
            cache: false,
            url: '/companyMessage',

            views: {
                'menuContent': {
                    templateUrl: 'templates/messageCompany.html',
                    controller: 'companyMessageController'
                }
            }
        })
        .state('user.dashboard', {
            cache: false,
            url: '/dashboard',
            views: {
                'menuContent': {
                    templateUrl: 'templates/dashboard.html',
                    controller: 'dashboardController'
                }
            }
        })
         .state('user.posts', {
            cache: false,
            url: '/posts',
            views: {
                'menuContent': {
                    templateUrl: 'templates/posts.html',
                    controller: 'postsController'
                }
            }
        })

         .state('user.postsDetails', {
            cache: false,
            url: '/postsDetails/:id',
            views: {
                'menuContent': {
                    templateUrl: 'templates/postsDetails.html',
                    controller: 'postsDetailsController'
                }
            }
        })


        ;
    });
