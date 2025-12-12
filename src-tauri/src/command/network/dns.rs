use crate::command_error;
use serde::{Deserialize, Serialize};
use std::{
    net::{Ipv4Addr, Ipv6Addr},
    thread::spawn,
};
use tauri::{AppHandle, Runtime};
use tokio::sync::oneshot;

#[derive(Debug, Serialize, Deserialize)]
pub struct Response {
    v4: Vec<Ipv4Addr>,
    v6: Vec<Ipv6Addr>,
    cname: Vec<String>,
}

#[tauri::command]
#[tracing::instrument(level = tracing::Level::DEBUG, ret, err(level = tracing::Level::ERROR))]
pub async fn query_dns<R: Runtime>(name: String, app: AppHandle<R>) -> Result<Response, Error> {
    let (req, res) = oneshot::channel();
    spawn(move || {
        let result = blocking_query_dns(name);
        let _ = req.send(result);
    });
    res.await?
}

fn blocking_query_dns(name: String) -> Result<Response, Error> {
    let resolver = trust_dns_resolver::Resolver::from_system_conf()?;

    // A记录 (IPV4)
    let response = pass_no_record_error(resolver.ipv4_lookup(&name))?;
    let v4 = response
        .map(|response| response.into_iter().map(|item| item.0).collect::<Vec<_>>())
        .unwrap_or_default();

    // AAAA记录 (IPV6)
    let response = pass_no_record_error(resolver.ipv6_lookup(&name))?;
    let v6 = response
        .map(|response| response.into_iter().map(|item| item.0).collect::<Vec<_>>())
        .unwrap_or_default();

    // CNAME记录
    let response = pass_no_record_error(
        resolver.lookup(&name, trust_dns_resolver::proto::rr::RecordType::CNAME),
    )?;
    let cname = response
        .map(|response| {
            response
                .into_iter()
                .map(|item| item.into_cname())
                .flatten()
                .map(|item| item.to_string())
                .collect::<Vec<_>>()
        })
        .unwrap_or_default();

    Ok(Response { v4, v6, cname })
}

fn pass_no_record_error<T>(
    result: Result<T, trust_dns_resolver::error::ResolveError>,
) -> Result<Option<T>, trust_dns_resolver::error::ResolveError> {
    match result {
        Ok(value) => Ok(Some(value)),
        Err(e) => match e.kind() {
            trust_dns_resolver::error::ResolveErrorKind::NoRecordsFound { .. } => Ok(None),
            _ => Err(e),
        },
    }
}

command_error! {
    (Io,"io error: {0}", #[from] std::io::Error),
    (Resolver, "lookup dns error: {0}", #[from] trust_dns_resolver::error::ResolveError),
    (Recv, "recv error: {0}", #[from] tokio::sync::oneshot::error::RecvError),
}
