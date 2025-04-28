import json
from typing import List
from fastapi import Depends, HTTPException, status
from api.v1.core.schemas import Permission
from api.v1.core.models import User, Role
from security import get_current_user

def get_user_permissions(user: User) -> List[Permission]:
    """Get all permissions for a user based on their roles"""
    permissions = set()
    for user_role in user.roles:
        role_permissions = json.loads(user_role.role.permissions)
        permissions.update(role_permissions)
    return list(permissions)

def has_permission(required_permission: Permission):
    """Dependency to check if a user has a specific permission"""
    async def permission_checker(current_user: User = Depends(get_current_user)):
        user_permissions = get_user_permissions(current_user)
        
        # Admin permission gives access to everything
        if Permission.ADMIN in user_permissions:
            return current_user
            
        if required_permission not in user_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied. Required permission: {required_permission}"
            )
        return current_user
    return permission_checker 