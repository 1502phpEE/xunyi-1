<?php namespace App\Http\Controllers;
/**
 * 登录功能
 * ============================================================================
 * laravel/public/login
 * ----------------------------------------------------------------------------
 * @controller     LoginController
 * ============================================================================
 * @Author: 耿文龙
 * @date    2017/5/13
 */
class LoginController extends Controller
{

    /*
    |--------------------------------------------------------------------------
    | Home Controller
    |--------------------------------------------------------------------------
    |
    | This controller renders your application's "dashboard" for users that
    | are authenticated. Of course, you are free to change or remove the
    | controller as you wish. It is just here to get your app started!
    |
    */

    /**
     * Create a new controller instance.
     *
     * @return void
     */

    /**
     * Show the application dashboard to the user.
     *
     * @return Response
     */

    public function index()
    {
        return view('login/UserLogin');
    }

}
