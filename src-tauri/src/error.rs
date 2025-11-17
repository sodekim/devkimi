#[macro_export]
macro_rules! serialize_error {
    ($ty:ty) => {
        impl serde::Serialize for $ty {
            fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
            where
                S: serde::Serializer,
            {
                let error = self.to_string();
                error.serialize(serializer)
            }
        }
    };
}

#[macro_export]
macro_rules! command_error {
    ($(($ident:ident, $msg:literal $(, $($tt:tt)*)?)),+ $(,)?) => {
        #[derive(Debug, thiserror::Error)]
        pub enum Error {
            $(
                #[error($msg)]
                $ident$(($($tt)*))?,
            )+
        }

        $crate::serialize_error!(Error);
    };

}
