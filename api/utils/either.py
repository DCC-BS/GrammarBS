from typing import TypeVar, Generic, Callable, Union, Any

L = TypeVar('L')  # Left type
R = TypeVar('R')  # Right type
T = TypeVar('T')  # Target type for transformations

def left(value: L) -> 'Either[L, Any]':
    return Either(value, False)

def right(value: R) -> 'Either[Any, R]':
    return Either(value, True)

class Either(Generic[L, R]):
    """

    Either monad implementation for handling success/failure cases.
    Left represents failure, Right represents success.
    """

    def __init__(self, value: Union[L, R], is_right: bool):
        self._value = value
        self._is_right = is_right

    def left(self) -> L:
        """
        Get the Left (failure) value. Raises ValueError if called on a Right.

        Returns:
            The Left value

        Raises:
            ValueError: If this is a Right
        """
        if not self.is_left():
            raise ValueError("Cannot get Left value from Right")
        return self._value  # type: ignore

    def right(self) -> R:
        """
        Get the Right (success) value. Raises ValueError if called on a Left.

        Returns:
            The Right value

        Raises:
            ValueError: If this is a Left
        """
        if not self.is_right():
            raise ValueError("Cannot get Right value from Left")
        return self._value  # type: ignore

    def is_right(self) -> bool:
        """Check if this is a Right (success) value."""
        return self._is_right

    def is_left(self) -> bool:
        """Check if this is a Left (failure) value."""
        return not self._is_right

    def map(self, f: Callable[[R], T]) -> 'Either[L, T]':
        """
        Apply a function to the Right value, leaving Left values unchanged.

        Args:
            f: Function to apply to the Right value

        Returns:
            New Either with the transformed Right value, or the original Left
        """
        if self.is_right():
            return Either.right(f(self._value))  # type: ignore
        return Either.left(self._value)  # type: ignore

    def bind(self, f: Callable[[R], 'Either[L, T]']) -> 'Either[L, T]':
        """
        Chain computations that may fail.

        Args:
            f: Function that returns a new Either

        Returns:
            Result of applying f to the Right value, or the original Left
        """
        if self.is_right():
            return f(self._value)  # type: ignore
        return Either.left(self._value)  # type: ignore

    def get_or_else(self, default: R) -> R:
        """
        Get the Right value or a default if this is a Left.

        Args:
            default: Value to return if this is a Left

        Returns:
            The Right value or the default
        """
        if self.is_right():
            return self._value  # type: ignore
        return default

    def fold(self, left_f: Callable[[L], T], right_f: Callable[[R], T]) -> T:
        """
        Apply one of two functions depending on whether this is a Left or Right.

        Args:
            left_f: Function to apply to Left value
            right_f: Function to apply to Right value

        Returns:
            Result of applying the appropriate function
        """
        if self.is_right():
            return right_f(self._value) # type: ignore
        return left_f(self._value) # type: ignore

    def __str__(self) -> str:
        kind = "Right" if self.is_right() else "Left"
        return f"{kind}({self._value})"

    def __repr__(self) -> str:
        return self.__str__()
