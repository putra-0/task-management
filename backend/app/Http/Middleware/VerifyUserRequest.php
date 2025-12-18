<?php

namespace App\Http\Middleware;

use App\Helpers\SecurityHelper;
use App\Models\RefreshToken;
use App\Models\User;
use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class VerifyUserRequest
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $bearer = $request->bearerToken() ?? '';

        try {
            throw_if(trim($bearer) === '');

            $accessToken = SecurityHelper::verifyJwt($bearer);

            $user = User::where('uuid', $accessToken->sub)->first();

            throw_if(is_null($user));

            $refreshTokenNotFound = RefreshToken::query()
                ->where('uuid', $accessToken->refresh_token)
                ->where('expires_at', '>', now())
                ->doesntExist();

            throw_if($refreshTokenNotFound);

            throw_if(is_null($user->email_verified_at));
        } catch (Throwable) {
            throw new AuthenticationException();
        }

        if ($request->routeIs('logout')) {
            return $next($request->merge([
                'refreshToken' => $accessToken->refresh_token,
            ]));
        }

        return $next($request);
    }
}
